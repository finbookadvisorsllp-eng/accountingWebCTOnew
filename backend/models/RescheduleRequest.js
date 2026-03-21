const mongoose = require("mongoose");

const RescheduleRequestSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    seniorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },

    // Original visit details
    originalDay: { type: String, required: true },       // "Mon", "Tue", etc. or date string
    originalFromTime: { type: String },
    originalToTime: { type: String },
    originalDate: { type: Date },                         // specific date if applicable
    
    // Accountant proposed alternative
    accountantProposedDay: { type: String },
    accountantProposedFromTime: { type: String },
    accountantProposedToTime: { type: String },

    reason: { type: String, required: true },

    status: {
      type: String,
      enum: [
        "pending_senior",
        "approved_by_senior",
        "rejected_by_senior",
        "sent_to_client",
        "client_responded",
        "completed",
      ],
      default: "pending_senior",
    },

    // Senior decision
    seniorResponse: {
      action: { type: String, enum: ["approved", "rejected"] },
      note: { type: String },
      respondedAt: { type: Date },
    },

    // Days proposed by senior for client to choose from
    clientProposedDays: [
      {
        day: { type: String },
        fromTime: { type: String },
        toTime: { type: String },
      },
    ],

    // Day selected by client
    clientSelectedDay: {
      day: { type: String },
      fromTime: { type: String },
      toTime: { type: String },
    },
  },
  { timestamps: true }
);

RescheduleRequestSchema.index({ client: 1, status: 1 });
RescheduleRequestSchema.index({ requestedBy: 1 });
RescheduleRequestSchema.index({ seniorId: 1, status: 1 });

module.exports = mongoose.model("RescheduleRequest", RescheduleRequestSchema);
