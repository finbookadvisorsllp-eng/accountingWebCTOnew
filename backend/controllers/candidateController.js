const Candidate = require("../models/Candidate");
const calculateProfilePercentage = require("../utils/calculateProfilePercentage");
const generateEmployeeId = require("../utils/generateEmployeeId");
const bcrypt = require("bcryptjs");

// @desc    Submit Interest Form (Public)
// @route   POST /api/candidates/interest
// @access  Public
// exports.submitInterestForm = async (req, res) => {
//   try {
//     const { personalInfo, education, workExperience, interestInfo, consent } =
//       req.body;

//     if (
//       !personalInfo ||
//       !personalInfo.firstName ||
//       !personalInfo.primaryContact?.number
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide required personal information",
//       });
//     }

//     // Check if candidate already exists
//     const existingCandidate = await Candidate.findOne({
//       "personalInfo.primaryContact.number": personalInfo.primaryContact.number,
//     });

//     if (existingCandidate) {
//       return res.status(400).json({
//         success: false,
//         message: "A candidate with this contact number already exists",
//       });
//     }

//     const candidate = await Candidate.create({
//       personalInfo,
//       education,
//       workExperience,
//       interestInfo,
//       consent,
//       documents: {
//         resume: req.body.resume,
//       },
//       status: "INTERESTED",
//       profilePercentage: 20,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Interest form submitted successfully",
//       data: candidate,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.submitInterestForm = async (req, res) => {
  try {
    // 🔥 FormData se string aayega
    const formData = JSON.parse(req.body.formData);

    const { personalInfo, education, workExperience, interestInfo, consent } =
      formData;

    if (
      !personalInfo ||
      !personalInfo.firstName ||
      !personalInfo.primaryContact?.number
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide required personal information",
      });
    }

    const existingCandidate = await Candidate.findOne({
      "personalInfo.primaryContact.number": personalInfo.primaryContact.number,
    });

    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: "A candidate with this contact number already exists",
      });
    }

    const candidate = await Candidate.create({
      personalInfo,
      education,
      workExperience,
      interestInfo,
      consent,
      documents: {
        resume: req.file ? `/uploads/${req.file.filename}` : "",
      },
      status: "INTERESTED",
      profilePercentage: 20,
    });

    res.status(201).json({
      success: true,
      message: "Interest form submitted successfully",
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Check if candidate exists (for auto-fetch in Exited form)
// @route   POST /api/candidates/check
// @access  Public
exports.checkCandidate = async (req, res) => {
  try {
    const { email, mobile } = req.body;

    if (!email && !mobile) {
      return res.status(400).json({
        success: false,
        message: "Please provide email or mobile number",
      });
    }

    const query = {};
    if (email) query["personalInfo.email"] = email;
    if (mobile) query["personalInfo.primaryContact.number"] = mobile;

    const candidate = await Candidate.findOne({
      $or: [
        { "personalInfo.email": email },
        { "personalInfo.primaryContact.number": mobile },
      ],
      status: { $in: ["INTERESTED", "ALLOWED_EXITED"] },
    });

    if (!candidate) {
      return res.json({
        success: true,
        exists: false,
        message: "No existing record found",
      });
    }

    res.json({
      success: true,
      exists: true,
      data: {
        _id: candidate._id,
        personalInfo: candidate.personalInfo,
        education: candidate.education,
        workExperience: candidate.workExperience,
        interestInfo: candidate.interestInfo,
        status: candidate.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit Exited Form (Public)
// @route   POST /api/candidates/exited
// @access  Public
exports.submitExitedForm = async (req, res) => {
  try {
    const {
      candidateId,
      contactInfo,
      exitedPersonalInfo,
      familyBackground,
      detailedEducation,
      detailedWorkExperience,
      professionalInterests,
      references,
      exitedDocuments,
      exitedConsent,
      personalInfo,
    } = req.body;

    let candidate;

    if (candidateId) {
      // Update existing candidate
      candidate = await Candidate.findById(candidateId);

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found",
        });
      }

      if (
        candidate.status !== "INTERESTED" &&
        candidate.status !== "ALLOWED_EXITED"
      ) {
        return res.status(400).json({
          success: false,
          message: "Cannot update candidate at this stage",
        });
      }

      // Update fields
      candidate.contactInfo = { ...candidate.contactInfo, ...contactInfo };
      candidate.exitedPersonalInfo = exitedPersonalInfo;
      candidate.familyBackground = familyBackground;
      candidate.detailedEducation = detailedEducation;
      candidate.detailedWorkExperience = detailedWorkExperience;
      candidate.professionalInterests = professionalInterests;
      candidate.references = references;
      candidate.exitedDocuments = {
        ...candidate.exitedDocuments,
        ...exitedDocuments,
      };
      candidate.exitedConsent = exitedConsent;
      candidate.status = "EXITED";
      candidate.profilePercentage = 50;

      await candidate.save();
    } else {
      // Create new candidate directly from Exited form
      if (!personalInfo || !contactInfo) {
        return res.status(400).json({
          success: false,
          message: "Please provide required information",
        });
      }

      candidate = await Candidate.create({
        personalInfo,
        contactInfo,
        exitedPersonalInfo,
        familyBackground,
        detailedEducation,
        detailedWorkExperience,
        professionalInterests,
        references,
        exitedDocuments,
        exitedConsent,
        status: "EXITED",
        profilePercentage: 50,
      });
    }

    res.status(200).json({
      success: true,
      message: "Exited form submitted successfully",
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all candidates (with filters)
// @route   GET /api/candidates
// @access  Private (Admin, Advisor)
exports.getCandidates = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { "personalInfo.firstName": { $regex: search, $options: "i" } },
        { "personalInfo.lastName": { $regex: search, $options: "i" } },
        { "contactInfo.email": { $regex: search, $options: "i" } },
        {
          "personalInfo.primaryContact.number": {
            $regex: search,
            $options: "i",
          },
        },
        { "adminInfo.employeeId": { $regex: search, $options: "i" } },
      ];
    }

    const candidates = await Candidate.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Candidate.countDocuments(query);

    res.json({
      success: true,
      data: candidates,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Private
exports.getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    res.json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update candidate status to ALLOWED_EXITED
// @route   PUT /api/candidates/:id/allow-exited
// @access  Private (Admin)
exports.allowExited = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (candidate.status !== "INTERESTED") {
      return res.status(400).json({
        success: false,
        message: "Candidate is not in INTERESTED status",
      });
    }

    candidate.status = "ALLOWED_EXITED";
    candidate.lastModifiedBy = req.user._id;
    await candidate.save();

    res.json({
      success: true,
      message: "Candidate allowed to fill exited form",
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve candidate and generate employee credentials
// @route   POST /api/candidates/:id/approve
// @access  Private (Admin)
exports.approveCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (candidate.status !== "EXITED") {
      return res.status(400).json({
        success: false,
        message: "Candidate must be in EXITED status to approve",
      });
    }

    const { designation, dateOfJoining, adminData } = req.body;

    // Generate employee ID
    const employeeId = await generateEmployeeId(Candidate);

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update candidate with admin info
    candidate.adminInfo = {
      employeeId,
      password: hashedPassword,
      designation,
      dateOfJoining,
      generatedBy: req.user._id,
      generatedAt: new Date(),
    };

    if (adminData) {
      candidate.employeeContactInfo =
        adminData.employeeContactInfo || candidate.employeeContactInfo;
      candidate.contractInfo = adminData.contractInfo || candidate.contractInfo;
      candidate.legalCompliance =
        adminData.legalCompliance || candidate.legalCompliance;
    }

    candidate.status = "APPROVED";
    candidate.profilePercentage = 80;
    candidate.lastModifiedBy = req.user._id;

    await candidate.save();

    res.json({
      success: true,
      message: "Candidate approved successfully",
      data: {
        candidate,
        credentials: {
          employeeId,
          temporaryPassword: tempPassword,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update admin fields for approved candidate
// @route   PUT /api/candidates/:id/admin-update
// @access  Private (Admin)
exports.updateAdminFields = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (candidate.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Only approved candidates can be updated by admin",
      });
    }

    const {
      employeeContactInfo,
      contractInfo,
      legalCompliance,
      designation,
      dateOfJoining,
    } = req.body;

    if (employeeContactInfo)
      candidate.employeeContactInfo = {
        ...candidate.employeeContactInfo,
        ...employeeContactInfo,
      };
    if (contractInfo)
      candidate.contractInfo = { ...candidate.contractInfo, ...contractInfo };
    if (legalCompliance)
      candidate.legalCompliance = {
        ...candidate.legalCompliance,
        ...legalCompliance,
      };
    if (designation) candidate.adminInfo.designation = designation;
    if (dateOfJoining) candidate.adminInfo.dateOfJoining = dateOfJoining;

    candidate.lastModifiedBy = req.user._id;
    await candidate.save();

    res.json({
      success: true,
      message: "Candidate updated successfully",
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Employee final confirmation
// @route   PUT /api/candidates/:id/final-confirmation
// @access  Private (Employee)
exports.finalConfirmation = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (candidate.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Profile not approved yet",
      });
    }

    candidate.finalConfirmation = {
      reviewCompleted: true,
      accuracyConfirmed: req.body.accuracyConfirmed || true,
      finalDigitalConfirmation: req.body.finalDigitalConfirmation || true,
      confirmedAt: new Date(),
    };

    candidate.status = "ACTIVE";
    candidate.profilePercentage = 100;

    await candidate.save();

    res.json({
      success: true,
      message: "Profile activated successfully",
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/candidates/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
  try {
    const stats = await Candidate.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalCandidates = await Candidate.countDocuments();

    const formattedStats = {
      total: totalCandidates,
      byStatus: {},
    };

    stats.forEach((stat) => {
      formattedStats.byStatus[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: formattedStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private (Admin)
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    await candidate.deleteOne();

    res.json({
      success: true,
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
