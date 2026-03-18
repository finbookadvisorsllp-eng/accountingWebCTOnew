// models/ClientBusinessSummary.js
const mongoose = require("mongoose");

const ClientBusinessSummarySchema = new mongoose.Schema(
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
    // SALES
    sales_total: {
      type: Number,
      default: 0,
    },
    sales_product_taxable: {
      type: Number,
      default: 0,
    },
    sales_service_taxable: {
      type: Number,
      default: 0,
    },
    sales_total_taxable: {
      type: Number,
      default: 0,
    },
    // PURCHASE
    purchase_total: {
      type: Number,
      default: 0,
    },
    purchase_rm: {
      type: Number,
      default: 0,
    },
    purchase_trading: {
      type: Number,
      default: 0,
    },
    purchase_pm: {
      type: Number,
      default: 0,
    },
    purchase_consumables: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Compound index to prevent duplicate entries for client + year + month
ClientBusinessSummarySchema.index({ client: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("ClientBusinessSummary", ClientBusinessSummarySchema);
