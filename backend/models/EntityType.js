const mongoose = require("mongoose");

const PAN_CODES = ["P", "F", "C", "G", "A", "H", "T"];

const EntityTypeSchema = new mongoose.Schema(
  {
    entityType: { type: String, required: true, unique: true },
    ownership: { type: String },
    applicableOwnership: { type: String },
    panClassification: {
      type: String,
      enum: PAN_CODES,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("EntityType", EntityTypeSchema);

module.exports.PAN_CODES = PAN_CODES;