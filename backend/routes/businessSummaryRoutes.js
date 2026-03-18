// routes/businessSummaryRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/businessSummaryController");
const { protect } = require("../middleware/auth");

// All routes require authentication
const auth = [protect]; // Allow both employee and admin to manage/view

// @route   POST /api/business-summary
// @desc    Create or Update Monthly Data
router.post("/", ...auth, ctrl.createOrUpdateSummary);

// @route   GET /api/business-summary/:clientId
// @desc    Fetch for specific client/year
router.get("/:clientId", ...auth, ctrl.getSummariesByYear);

// @route   GET /api/business-summary/:clientId/:year/:month
// @desc    Fetch for specific client/year/month
router.get("/:clientId/:year/:month", ...auth, ctrl.getSingleSummary);

module.exports = router;
