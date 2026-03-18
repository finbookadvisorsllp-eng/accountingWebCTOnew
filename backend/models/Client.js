// models/Client.js
const mongoose = require("mongoose");

const TaskApplicabilitySchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ComplianceTask",
    required: true,
  },
  dueDate: { type: Date },
  frequency: { type: String }, // e.g. Monthly, Quarterly
});

const ClientSchema = new mongoose.Schema(
  {
    entityName: { type: String, required: true, index: true },
    clientId: { type: String, unique: true, index: true }, // generated
    passwordHash: { type: String }, // hashed
    empAssign: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }, // accountant
    visitTimeFrom: { type: String },
    visitTimeTo: { type: String },
    visitDays: [{ type: String }], // Mon..Sun
    groupCompany: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    entityType: { type: mongoose.Schema.Types.ObjectId, ref: "EntityType" },
    registrationNumber: { type: String },
    dateOfIncorporation: { type: Date },
    registeredOfficeAddress: { type: String },
    natureOfBusiness: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NatureOfBusiness",
    },
    tin: { type: String },
    gst: { type: String },
    pan: { type: String },
    contactName: { type: String },
    contactPhone: { type: String },
    contactEmail: { type: String },
    complianceStatus: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Compliance" },
    ],
    taskApplicability: [TaskApplicabilitySchema],
    status: {
      type: String,
      enum: ["active", "inactive", "dissolved"],
      default: "active",
    },
    remarks: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Client", ClientSchema);
