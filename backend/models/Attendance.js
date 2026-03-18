const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["office", "client"],
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    totalMinutes: {
      type: Number,
      default: 0,
    },
    location: {
      checkInLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String },
      },
      checkOutLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String },
      },
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["checked-in", "checked-out", "auto-closed", "late", "absent"],
      default: "checked-in",
    },
  },
  { timestamps: true }
);

// Compound index: one office check-in per employee per day; one client check-in per client per day
AttendanceSchema.index({ employee: 1, type: 1, date: 1, client: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
