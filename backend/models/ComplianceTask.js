const mongoose = require("mongoose");

const ComplianceTaskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // 🔒 FUTURE USE (NOT USED NOW)
    dueRule: {
      type: Object,
      default: null,
    },

    frequency: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ComplianceTask", ComplianceTaskSchema);
