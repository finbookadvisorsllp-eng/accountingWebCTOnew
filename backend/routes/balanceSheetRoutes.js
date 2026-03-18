// routes/balanceSheetRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/balanceSheetController");
const { protect } = require("../middleware/auth");

const auth = [protect];

// @route   POST /api/balance-sheet
// @desc    Create or Update Balance Sheet Records (Bulk)
router.post("/", ...auth, ctrl.createOrUpdateBS);

// @route   GET /api/balance-sheet/:clientId
// @desc    Fetch for specific client/year
router.get("/:clientId", ...auth, ctrl.getBSByYear);

// @route   GET /api/balance-sheet/:clientId/summary
// @desc    Fetch summary with balance_difference
router.get("/:clientId/summary", ...auth, ctrl.getBSSummary);

module.exports = router;
