// models/ClientGSTLiability.js
const mongoose = require("mongoose");

const ClientGSTLiabilitySchema = new mongoose.Schema(
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
    month: {
      type: String,
      required: true,
      trim: true,
    },
    // SECTION 1: GST OUTPUT
    output_cgst: { type: Number, default: 0 },
    output_sgst: { type: Number, default: 0 },
    output_igst: { type: Number, default: 0 },
    output_cess: { type: Number, default: 0 },
    output_total: { type: Number, default: 0 },

    // SECTION 2: GST INPUT
    input_cgst: { type: Number, default: 0 },
    input_sgst: { type: Number, default: 0 },
    input_igst: { type: Number, default: 0 },
    input_cess: { type: Number, default: 0 },
    input_total: { type: Number, default: 0 },

    // SECTION 3: GST INPUT CARRY FORWARD
    cf_cgst: { type: Number, default: 0 },
    cf_sgst: { type: Number, default: 0 },
    cf_igst: { type: Number, default: 0 },
    cf_cess: { type: Number, default: 0 },
    cf_total: { type: Number, default: 0 },

    // CALCULATIONS
    gst_payable: { type: Number, default: 0 },
    next_month_carry_forward: { type: Number, default: 0 },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Compound index for uniqueness
ClientGSTLiabilitySchema.index({ client: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("ClientGSTLiability", ClientGSTLiabilitySchema);
