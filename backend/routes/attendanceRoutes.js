const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/attendanceController");
const { protect, authorize } = require("../middleware/auth");

// All routes require employee authentication
const auth = [protect, authorize("employee")];

// ─── Office Attendance ───
router.post("/office/check-in", ...auth, ctrl.officeCheckIn);
router.post("/office/check-out", ...auth, ctrl.officeCheckOut);
router.get("/office/today", ...auth, ctrl.officeToday);
router.get("/office/history", ...auth, ctrl.officeHistory);

// ─── Client Visit Attendance ───
router.post("/client/:clientId/check-in", ...auth, ctrl.clientCheckIn);
router.post("/client/:clientId/check-out", ...auth, ctrl.clientCheckOut);
router.get("/client/:clientId/history", ...auth, ctrl.clientHistory);

// ─── Summary ───
router.get("/summary", ...auth, ctrl.getSummary);

module.exports = router;
