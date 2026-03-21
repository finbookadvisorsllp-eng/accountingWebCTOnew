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

    const { personalInfo, detailedEducation, detailedWorkExperience, interestInfo, consent } =
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
      detailedEducation,
      detailedWorkExperience,
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
      data: candidate,
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
      if (status.includes(",")) {
        query.status = { $in: status.split(",") };
      } else {
        query.status = status;
      }
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

    // Resolve reportingAuthority name
    let reportingAuthorityName = "Admin";
    if (candidate.adminInfo?.reportingAuthority && candidate.adminInfo.reportingAuthority !== "Admin") {
      const supervisor = await Candidate.findOne({ "adminInfo.employeeId": candidate.adminInfo.reportingAuthority });
      if (supervisor) {
        reportingAuthorityName = `${supervisor.personalInfo?.firstName || ""} ${supervisor.personalInfo?.lastName || ""}`.trim() || candidate.adminInfo.reportingAuthority;
      } else {
        reportingAuthorityName = candidate.adminInfo.reportingAuthority;
      }
    }

    const candidateObj = candidate.toObject();
    if (candidateObj.adminInfo) {
      candidateObj.adminInfo.reportingAuthorityName = reportingAuthorityName;
    }

    res.json({
      success: true,
      data: candidateObj,
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

// @desc    Approve candidate and generate employee credentials (Admin Onboard)
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
        message: "Candidate must be in EXITED status to onboard",
      });
    }

    // Parse JSON fields from multipart form-data
    const safeJSON = (v) => { try { return typeof v === 'string' ? JSON.parse(v) : v; } catch { return v; } };

    const designation = req.body.designation;
    const reportingAuthority = req.body.reportingAuthority;
    const dateOfJoining = req.body.dateOfJoining;
    const familyBackground = safeJSON(req.body.familyBackground);
    const contactInfo = safeJSON(req.body.contactInfo);
    const contractInfo = safeJSON(req.body.contractInfo);
    const legalCompliance = safeJSON(req.body.legalCompliance);

    // ── Mandatory admin fields ──
    if (!designation || !reportingAuthority) {
      return res.status(400).json({
        success: false,
        message:
          "Designation and Reporting Authority are mandatory",
      });
    }

    // ── Generate prefix-based Employee ID ──
    const employeeId = await generateEmployeeId(Candidate, designation);

    // ── Generate temporary password ──
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // ── Update adminInfo ──
    candidate.adminInfo = {
      employeeId,
      password: hashedPassword,
      designation,
      reportingAuthority,
      dateOfJoining: dateOfJoining || new Date(),
      generatedBy: req.user._id,
      generatedAt: new Date(),
    };

    // ── Handle file uploads ──
    if (req.files) {
      if (!candidate.adminDocuments) candidate.adminDocuments = {};
      if (req.files.passportPhoto) {
        candidate.adminDocuments.passportPhoto = `/uploads/${req.files.passportPhoto[0].filename}`;
      }
      if (req.files.depositProof) {
        candidate.adminDocuments.depositProof = `/uploads/${req.files.depositProof[0].filename}`;
      }
    }

    // ── Tab 1: Update fetched/editable fields ──
    if (familyBackground) {
      candidate.familyBackground = {
        ...candidate.familyBackground?.toObject?.() || candidate.familyBackground || {},
        ...familyBackground,
      };
    }
    if (contactInfo) {
      candidate.contactInfo = {
        ...candidate.contactInfo?.toObject?.() || candidate.contactInfo || {},
        ...contactInfo,
      };
    }

    // ── Tab 2: Contract & Deposit ──
    if (contractInfo) {
      candidate.contractInfo = contractInfo;
    }

    // ── Tab 3: Legal Compliance ──
    if (legalCompliance) {
      candidate.legalCompliance = legalCompliance;
    }

    // ── Update status ──
    candidate.status = "APPROVED";
    candidate.profilePercentage = 80;
    candidate.lastModifiedBy = req.user._id;

    await candidate.save();

    res.json({
      success: true,
      message: "Candidate onboarded successfully",
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

// @desc    Update admin fields for approved/active candidate
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

    if (!["APPROVED", "ACTIVE", "EXITED", "ALLOWED_EXITED"].includes(candidate.status)) {
      return res.status(400).json({
        success: false,
        message: "Only approved, active, or exited candidates can be updated by admin",
      });
    }

    const isOnboarding = ["EXITED", "ALLOWED_EXITED"].includes(candidate.status);

    // Parse JSON fields from multipart form-data
    const safeJSON = (v) => { try { return typeof v === 'string' ? JSON.parse(v) : v; } catch { return v; } };

    const designation = req.body.designation;
    const reportingAuthority = req.body.reportingAuthority;
    const dateOfJoining = req.body.dateOfJoining;
    const employeeContactInfo = safeJSON(req.body.employeeContactInfo);
    const contractInfo = safeJSON(req.body.contractInfo);
    const legalCompliance = safeJSON(req.body.legalCompliance);
    const familyBackground = safeJSON(req.body.familyBackground);
    const contactInfo = safeJSON(req.body.contactInfo);

    // Update adminInfo fields
    if (isOnboarding) {
      // ── Generate employee ID and password for onboarding ──
      if (!designation || !reportingAuthority) {
        return res.status(400).json({
          success: false,
          message: "Designation and Reporting Authority are mandatory for onboarding",
        });
      }
      const employeeId = await generateEmployeeId(Candidate, designation);
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      candidate.adminInfo = {
        employeeId,
        password: hashedPassword,
        designation,
        reportingAuthority,
        dateOfJoining: dateOfJoining || new Date(),
        generatedBy: req.user._id,
        generatedAt: new Date(),
      };

      candidate.status = "APPROVED";
      candidate.profilePercentage = 80;

      // Store credentials for response
      var credentials = { employeeId, temporaryPassword: tempPassword };
    } else {
      if (designation) candidate.adminInfo.designation = designation;
      if (reportingAuthority) candidate.adminInfo.reportingAuthority = reportingAuthority;
      if (dateOfJoining) candidate.adminInfo.dateOfJoining = dateOfJoining;
    }

    // Update other sections
    if (familyBackground) {
      candidate.familyBackground = {
        ...candidate.familyBackground?.toObject?.() || candidate.familyBackground || {},
        ...familyBackground,
      };
    }
    if (contactInfo) {
      candidate.contactInfo = {
        ...candidate.contactInfo?.toObject?.() || candidate.contactInfo || {},
        ...contactInfo,
      };
    }
    if (employeeContactInfo) {
      candidate.employeeContactInfo = {
        ...candidate.employeeContactInfo?.toObject?.() || candidate.employeeContactInfo || {},
        ...employeeContactInfo,
      };
    }
    if (contractInfo) {
      candidate.contractInfo = { ...candidate.contractInfo?.toObject?.() || candidate.contractInfo || {}, ...contractInfo };
    }
    if (legalCompliance) {
      candidate.legalCompliance = { ...candidate.legalCompliance?.toObject?.() || candidate.legalCompliance || {}, ...legalCompliance };
    }

    // Handle file uploads
    if (req.files) {
      if (!candidate.adminDocuments) candidate.adminDocuments = {};
      if (req.files.passportPhoto) {
        candidate.adminDocuments.passportPhoto = `/uploads/${req.files.passportPhoto[0].filename}`;
      }
      if (req.files.depositProof) {
        candidate.adminDocuments.depositProof = `/uploads/${req.files.depositProof[0].filename}`;
      }
    }

    candidate.lastModifiedBy = req.user._id;
    await candidate.save();

    const responseData = { candidate };
    if (isOnboarding && credentials) {
      responseData.credentials = credentials;
    }

    res.json({
      success: true,
      message: isOnboarding ? "Candidate onboarded successfully" : "Candidate updated successfully",
      data: responseData,
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

// @desc    Employee accepts contract terms (gate unlock)
// @route   PUT /api/candidates/:id/accept-contract
// @access  Private (Employee)
exports.acceptContract = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (!["APPROVED", "ACTIVE"].includes(candidate.status)) {
      return res.status(400).json({
        success: false,
        message: "Only approved employees can accept the contract",
      });
    }

    candidate.employeeContractAcceptance = {
      allTermsAccepted: true,
      acceptedAt: new Date(),
      digitalSignature: true,
    };

    // Activate the employee immediately upon contract acceptance
    if (candidate.status === "APPROVED") {
      candidate.status = "ACTIVE";
    }

    await candidate.save();

    res.json({
      success: true,
      message: "Contract accepted successfully",
      data: candidate.employeeContractAcceptance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Employee updates their own profile (editable fields only)
// @route   PUT /api/candidates/:id/update-profile
// @access  Private (Employee)
exports.updateOwnProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (!["APPROVED", "ACTIVE"].includes(candidate.status)) {
      return res.status(400).json({
        success: false,
        message: "Only approved employees can update their profile",
      });
    }

    let familyBackground, contactInfo, legalCompliance, exitedPersonalInfo;

    try {
      familyBackground = req.body.familyBackground ? JSON.parse(req.body.familyBackground) : {};
      contactInfo = req.body.contactInfo ? JSON.parse(req.body.contactInfo) : {};
      legalCompliance = req.body.legalCompliance ? JSON.parse(req.body.legalCompliance) : {};
      exitedPersonalInfo = req.body.exitedPersonalInfo ? JSON.parse(req.body.exitedPersonalInfo) : {};
    } catch {
      // Fallback for raw JSON if not sent as multipart stringified
      familyBackground = req.body.familyBackground || {};
      contactInfo = req.body.contactInfo || {};
      legalCompliance = req.body.legalCompliance || {};
      exitedPersonalInfo = req.body.exitedPersonalInfo || {};
    }

    // Handle Profile Avatar upload
    if (req.file) {
      candidate.profileAvatar = `/uploads/${req.file.filename}`;
    }

    // Employee-editable fields only (NOT admin fields)
    if (Object.keys(familyBackground).length > 0) {
      candidate.familyBackground = {
        ...candidate.familyBackground?.toObject?.() || candidate.familyBackground || {},
        ...familyBackground,
      };
    }
    if (Object.keys(contactInfo).length > 0) {
      candidate.contactInfo = {
        ...candidate.contactInfo?.toObject?.() || candidate.contactInfo || {},
        ...contactInfo,
      };
    }
    if (Object.keys(legalCompliance).length > 0) {
      // Merge at nested level to prevent overwriting admin-set values
      const existing = candidate.legalCompliance?.toObject?.() || candidate.legalCompliance || {};
      candidate.legalCompliance = {
        ...existing,
        aadharNumber: legalCompliance.aadharNumber || existing.aadharNumber,
        panNumber: legalCompliance.panNumber || existing.panNumber,
        bankDetails: {
          ...existing.bankDetails,
          ...(legalCompliance.bankDetails || {}),
        },
        emergencyContact: {
          ...existing.emergencyContact,
          ...(legalCompliance.emergencyContact || {}),
        },
        criminalRecordDeclaration: existing.criminalRecordDeclaration,
      };
    }
    if (Object.keys(exitedPersonalInfo).length > 0) {
      candidate.exitedPersonalInfo = {
        ...candidate.exitedPersonalInfo?.toObject?.() || candidate.exitedPersonalInfo || {},
        ...exitedPersonalInfo,
      };
    }

    // Recalculate profile percentage
    candidate.profilePercentage = calculateProfilePercentage(candidate);

    await candidate.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Employee changes their password
// @route   PUT /api/candidates/:id/change-password
// @access  Private (Employee)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // We need to explicitly select password if it was excluded by default (though it isn't currently)
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    if (!candidate.adminInfo || !candidate.adminInfo.password) {
       return res.status(400).json({ success: false, message: "No password set for this account" });
    }

    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare(currentPassword, candidate.adminInfo.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect current password" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    candidate.adminInfo.password = await bcrypt.hash(newPassword, salt);

    await candidate.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get team members reporting to current employee (recursive)
// @route   GET /api/candidates/my-team
// @access  Private (Employee)
exports.getMyTeam = async (req, res) => {
  try {
    const Client = require("../models/Client");
    const currentUser = await Candidate.findById(req.user._id);

    if (!currentUser || !currentUser.adminInfo?.employeeId) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const myEmpId = currentUser.adminInfo.employeeId;
    const myDesignation = currentUser.adminInfo.designation || "Accountant";

    // Recursively find all subordinates
    async function findSubordinates(supervisorEmpId, depth = 1) {
      const directReports = await Candidate.find({
        "adminInfo.reportingAuthority": supervisorEmpId,
        status: { $in: ["APPROVED", "ACTIVE"] },
      }).select("personalInfo.firstName personalInfo.lastName adminInfo.employeeId adminInfo.designation adminInfo.reportingAuthority adminInfo.dateOfJoining personalInfo.email status");

      let allReports = [];

      for (const report of directReports) {
        // Count clients assigned to this person
        const clientCount = await Client.countDocuments({ empAssign: report._id });
        
        const reportObj = {
          _id: report._id,
          name: `${report.personalInfo?.firstName || ""} ${report.personalInfo?.lastName || ""}`.trim(),
          employeeId: report.adminInfo?.employeeId,
          designation: report.adminInfo?.designation || "Accountant",
          reportsTo: supervisorEmpId,
          depth,
          clientCount,
          status: report.status,
          dateOfJoining: report.adminInfo?.dateOfJoining,
        };

        allReports.push(reportObj);

        // Recurse for sub-reports (Manager → Senior → Accountant)
        const subReports = await findSubordinates(report.adminInfo.employeeId, depth + 1);
        allReports = allReports.concat(subReports);
      }

      return allReports;
    }

    const team = await findSubordinates(myEmpId);

    // Summary stats
    const summary = {
      totalMembers: team.length,
      byDesignation: {},
      totalClients: team.reduce((sum, m) => sum + m.clientCount, 0),
    };
    team.forEach((m) => {
      summary.byDesignation[m.designation] = (summary.byDesignation[m.designation] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        currentUser: {
          name: `${currentUser.personalInfo?.firstName || ""} ${currentUser.personalInfo?.lastName || ""}`.trim(),
          employeeId: myEmpId,
          designation: myDesignation,
        },
        team,
        summary,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
