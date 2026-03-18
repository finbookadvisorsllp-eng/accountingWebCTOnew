// routes/gstLiabilityRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/gstLiabilityController");
const { protect } = require("../middleware/auth");

const auth = [protect];

// @route   POST /api/gst-liability
// @desc    Create or Update GST Liability
router.post("/", ...auth, ctrl.createOrUpdateLiability);

// @route   GET /api/gst-liability/:clientId
// @desc    Fetch for specific client/year
router.get("/:clientId", ...auth, ctrl.getLiabilitiesByYear);

// @route   GET /api/gst-liability/:clientId/:year/:month
// @desc    Fetch for specific client/year/month
router.get("/:clientId/:year/:month", ...auth, ctrl.getSingleLiability);

module.exports = router;
