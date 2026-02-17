const express = require("express");
const router = express.Router();
const {
  getCandidates,
  getCandidate,
  approveCandidate,
  updateAdminFields,
  finalConfirmation,
  allowExited,
  deleteCandidate,
  getDashboardStats,
  getAllEmployees,
  getEmployeeProfile,
  updateEmployeeProfile
} = require("../controllers/candidateController");
const { protect, authorize } = require("../middleware/auth");

// ==================== ADMIN DASHBOARD ROUTES ====================
router.get("/dashboard/stats", protect, authorize("admin"), getDashboardStats);

// ==================== CANDIDATE ROUTES (Admin) ====================
router.get("/candidates", protect, authorize("admin", "advisor"), getCandidates);
router.get("/candidates/:id", protect, authorize("admin", "advisor"), getCandidate);
router.post("/candidates/:id/approve", protect, authorize("admin"), approveCandidate);
router.put("/candidates/:id/admin-update", protect, authorize("admin"), updateAdminFields);
router.put("/candidates/:id/final-confirmation", protect, authorize("admin"), finalConfirmation);
router.put("/candidates/:id/allow-exited", protect, authorize("admin"), allowExited);
router.delete("/candidates/:id", protect, authorize("admin"), deleteCandidate);
router.patch("/candidates/:id/status", protect, authorize("admin"), (req, res) => {
  // Update candidate status
  res.json({ success: true, message: "Status updated" });
});

// ==================== EMPLOYEE ROUTES (Admin) ====================
router.get("/employees", protect, authorize("admin"), getAllEmployees);
router.get("/employees/:id", protect, authorize("admin"), getEmployeeProfile);
router.put("/employees/:id", protect, authorize("admin"), updateEmployeeProfile);

module.exports = router;
