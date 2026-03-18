// models/ClientBalanceSheetRecord.js
const mongoose = require("mongoose");

const ClientBalanceSheetRecordSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["asset", "liability", "equity"],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    sub_category: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      default: 0,
      min: [0, "Amount cannot be negative"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Compound index for uniqueness
ClientBalanceSheetRecordSchema.index(
  { client: 1, year: 1, type: 1, category: 1, sub_category: 1 },
  { unique: true }
);

module.exports = mongoose.model("ClientBalanceSheetRecord", ClientBalanceSheetRecordSchema);
