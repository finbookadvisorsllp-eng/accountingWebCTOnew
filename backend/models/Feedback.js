const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    greetingRating: {
      type: String,
      enum: ["Very Good", "Good", "Poor"],
      required: [true, "Greeting rating is required"],
    },
    discoverySource: {
      type: String,
      enum: ["Friends", "Neighbours", "By Ads/Others"],
      required: [true, "Discovery source is required"],
    },
    pricingRating: {
      type: String,
      enum: ["Very Good", "Good", "Poor"],
      required: [true, "Pricing rating is required"],
    },
    timelineRating: {
      type: String,
      enum: ["2-3 Weeks", "Less than 2 weeks", "Longer than 3 weeks"],
      required: [true, "Timeline rating is required"],
    },
    message: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
