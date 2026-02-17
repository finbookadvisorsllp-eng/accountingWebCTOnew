const express = require("express");
const router = express.Router();
const {
  getCandidates,
  getCandidate,
  addInterest,
  addExit,
  getEmployeeProfile,
  updateProfile
} = require("../controllers/candidateController");
const { protect, authorize } = require("../middleware/auth");

// ==================== EMPLOYEE PROFILE ROUTES ====================
router.get("/profile", protect, authorize("employee"), getEmployeeProfile);
router.put("/profile", protect, authorize("employee"), updateProfile);

// ==================== CANDIDATE ROUTES (Employee) ====================
router.get("/candidates", protect, authorize("employee"), getCandidates);
router.get("/candidates/:id", protect, authorize("employee"), getCandidate);
router.put("/candidates/:id/interest", protect, authorize("employee"), addInterest);
router.post("/candidates/:id/exit", protect, authorize("employee"), addExit);

module.exports = router;
