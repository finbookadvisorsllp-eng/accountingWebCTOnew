// routes/pnlRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/pnlController");
const { protect } = require("../middleware/auth");

const auth = [protect];

// @route   POST /api/pnl
// @desc    Create or Update P&L Records (Bulk)
router.post("/", ...auth, ctrl.createOrUpdatePnL);

// @route   GET /api/pnl/:clientId
// @desc    Fetch for specific client/year
router.get("/:clientId", ...auth, ctrl.getPnLByYear);

// @route   GET /api/pnl/:clientId/summary
// @desc    Fetch summary of totals
router.get("/:clientId/summary", ...auth, ctrl.getPnLSummary);

module.exports = router;
