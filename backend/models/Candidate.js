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
    profileAvatar: {
      type: String,
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
      fatherSpouseFirstName: String,
      fatherSpouseLastName: String,
      fatherSpouseContact: String,
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
      reportingAuthority: String, // Employee ID of the reporting senior
      dateOfJoining: Date,
      generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      generatedAt: Date,
    },

    adminDocuments: {
      passportPhoto: String,
      depositProof: String,
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
      // Contract point acceptances
      workHoursAccepted: { type: Boolean, default: false },
      responsibilitiesAccepted: { type: Boolean, default: false },
      termsOfEmploymentAccepted: { type: Boolean, default: false },
      ndaAccepted: { type: Boolean, default: false },
      salaryTermsAccepted: { type: Boolean, default: false },
      terminationClauseAccepted: { type: Boolean, default: false },
      legalComplianceAccepted: { type: Boolean, default: false },
      otherTermsAccepted: { type: Boolean, default: false },
      contractAcceptedHindi: { type: Boolean, default: false },
      contractAcceptedEnglish: { type: Boolean, default: false },
      digitalSignature: { type: Boolean, default: false },
      depositAmount: Number,
      depositConfirmed: { type: Boolean, default: false },
    },

    legalCompliance: {
      aadharNumber: String,
      panNumber: String,
      bankDetails: {
        accountHolderName: String,
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        branchName: String,
      },
      emergencyContact: {
        name: String,
        relationship: String,
        contact: String,
        email: String,
      },
      criminalRecordDeclaration: { type: Boolean, default: false },
      criminalRecordDetails: String,
    },

    // EMPLOYEE CONTRACT ACCEPTANCE (gate before app access)
    employeeContractAcceptance: {
      allTermsAccepted: { type: Boolean, default: false },
      acceptedAt: Date,
      digitalSignature: { type: Boolean, default: false },
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
