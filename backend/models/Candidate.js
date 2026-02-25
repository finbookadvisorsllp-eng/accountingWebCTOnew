const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["INTERESTED", "ALLOWED_EXITED", "EXITED", "APPROVED", "ACTIVE"],
      default: "INTERESTED",
    },
    profilePercentage: {
      type: Number,
      default: 0,
    },

    // INTEREST FORM FIELDS (20% Profile)
    personalInfo: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      dateOfBirth: { type: Date },
      gender: { type: String, enum: ["Male", "Female", "Other", ""] },
      email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email",
        ],
      },
      primaryContact: {
        countryCode: { type: String, default: "+91" },
        number: { type: String, unique: true, sparse: true },
      },
      currentAddress: {
        address: String,
        city: String,
        state: String,
        pin: String,
      },
    },

    education: {
      highestQualification: String,
      yearOfPassing: Number,
      certifications: [String],
    },

    workExperience: {
      jobTitle: String,
      companyName: String,
      yearsOfExperience: Number,
      responsibilities: String,
    },

    interestInfo: {
      whyJoin: String,
      careerGoals: String,
      sourceOfAwareness: String,
    },

    documents: {
      resume: String,
    },

    consent: {
      accuracyDeclaration: { type: Boolean, default: false },
      dataProcessingConsent: { type: Boolean, default: false },
    },

    // EXITED FORM ADDITIONAL FIELDS (50% Profile)
    exitedPersonalInfo: {
      maritalStatus: {
        type: String,
        enum: ["Single", "Married", "Divorced", "Widowed", ""],
      },
      nationality: String,
      languagesKnown: [String],
    },

    contactInfo: {
      // email: {
      //   type: String,
      //   unique: true,
      //   sparse: true,
      //   lowercase: true,
      //   trim: true,
      // },
      alternateMobile: String,
      permanentAddress: {
        address: String,
        city: String,
        state: String,
        pin: String,
        sameAsCurrent: { type: Boolean, default: false },
      },
    },

    familyBackground: {
      fatherOrSpouseName: String,
      occupation: String,
      numberOfChildren: Number,
      numberOfSiblings: Number,
      familyIncome: String,
    },

    detailedEducation: [
      {
        level: {
          type: String,
          enum: ["10th", "12th", "Graduation", "Post-Graduation", "Other"],
        },
        degree: String,
        institution: String,
        yearOfPassing: Number,
        percentage: Number,
        achievements: String,
      },
    ],

    detailedWorkExperience: [
      {
        employerName: String,
        jobTitle: String,
        startDate: Date,
        endDate: Date,
        responsibilities: String,
        reasonForLeaving: String,
        skills: [String],
      },
    ],

    professionalInterests: {
      whyJoinTeam: String,
      longTermGoals: String,
      preferredWorkAreas: [String],
      availabilityToJoin: String,
    },

    references: [
      {
        name: String,
        relationship: String,
        contact: String,
        email: String,
      },
    ],

    exitedDocuments: {
      passportPhoto: String,
      addressProof: String,
      identityProof: String,
    },

    exitedConsent: {
      dataCollectionConsent: { type: Boolean, default: false },
      informationAccuracy: { type: Boolean, default: false },
      termsAgreement: { type: Boolean, default: false },
      digitalSignature: { type: Boolean, default: false },
    },

    // ADMIN FIELDS (80% Profile)
    adminInfo: {
      employeeId: { type: String, unique: true, sparse: true },
      password: String,
      designation: String,
      dateOfJoining: Date,
      generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      generatedAt: Date,
    },

    employeeContactInfo: {
      primaryEmail: String,
      contactNumbers: [String],
      residentialAddressWithProof: {
        address: String,
        gpsCoordinates: {
          latitude: Number,
          longitude: Number,
        },
        photos: [String],
      },
    },

    contractInfo: {
      contractAcceptedHindi: { type: Boolean, default: false },
      contractAcceptedEnglish: { type: Boolean, default: false },
      digitalSignature: String,
      depositAmount: Number,
      depositProof: String,
      depositConfirmed: { type: Boolean, default: false },
    },

    legalCompliance: {
      aadharNumber: String,
      panNumber: String,
      bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        branchName: String,
      },
      emergencyContact: {
        name: String,
        relationship: String,
        contact: String,
      },
      criminalRecordDeclaration: { type: Boolean, default: false },
    },

    // EMPLOYEE FINAL CONFIRMATION (100% Profile)
    finalConfirmation: {
      reviewCompleted: { type: Boolean, default: false },
      accuracyConfirmed: { type: Boolean, default: false },
      finalDigitalConfirmation: { type: Boolean, default: false },
      confirmedAt: Date,
    },

    // Metadata
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
// candidateSchema.index({ 'contactInfo.email': 1 });
// candidateSchema.index({ 'personalInfo.primaryContact.number': 1 });
// candidateSchema.index({ 'adminInfo.employeeId': 1 });
candidateSchema.index({ status: 1 });

// Pre-save middleware to update profile percentage
candidateSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Candidate", candidateSchema);
