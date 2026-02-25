const mongoose = require("mongoose");

const COMPLEXITY_LEVELS = ["Low", "Moderate", "High", "Very High"];

const NatureOfBusinessSchema = new mongoose.Schema(
  {
    businessGroup: { type: String, required: true },
    natureOfBusiness: { type: String, required: true, unique: true },
    description: { type: String },
    operationalComplexity: {
      type: String,
      enum: COMPLEXITY_LEVELS,
      required: true,
    },
    difficultyScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("NatureOfBusiness", NatureOfBusinessSchema);
