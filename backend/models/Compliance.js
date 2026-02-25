const mongoose = require("mongoose");

const ComplianceSchema = new mongoose.Schema(
  {
    complianceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    complianceName: {
      type: String,
      required: true,
      trim: true,
    },

    typeOfCompliance: {
      type: String,
      required: true,
    },

    applicableEntityType: {
      type: String,
      required: true,
    },

    limitApplicable: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    // 🔥 Will handle logic later
    dueDateRule: {
      type: String,
      default: null,
    },

    frequency: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Compliance", ComplianceSchema);
