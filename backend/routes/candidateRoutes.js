const express = require("express");
const router = express.Router();
const {
  submitInterestForm,
  checkCandidate,
  submitExitedForm,
  getCandidates,
  getCandidate,
  allowExited,
  approveCandidate,
  updateAdminFields,
  finalConfirmation,
  getStats,
  deleteCandidate,
} = require("../controllers/candidateController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public routes
router.post("/interest", upload.single("resume"), submitInterestForm);
router.post("/check", checkCandidate);
router.post("/exited", submitExitedForm);

// Protected routes
router.get("/", protect, authorize("admin", "advisor"), getCandidates);
router.get("/stats", protect, authorize("admin"), getStats);
router.get("/:id", protect, getCandidate);
router.put("/:id/allow-exited", protect, authorize("admin"), allowExited);
router.post("/:id/approve", protect, authorize("admin"), approveCandidate);
router.put("/:id/admin-update", protect, authorize("admin"), updateAdminFields);
router.put("/:id/final-confirmation", protect, finalConfirmation);
router.delete("/:id", protect, authorize("admin"), deleteCandidate);

module.exports = router;
