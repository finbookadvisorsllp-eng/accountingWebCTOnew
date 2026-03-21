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
  acceptContract,
  updateOwnProfile,
  getStats,
  deleteCandidate,
  changePassword,
  getMyTeam,
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
router.get("/my-team", protect, getMyTeam);
router.get("/:id", protect, getCandidate);
router.put("/:id/allow-exited", protect, authorize("admin"), allowExited);
router.post(
  "/:id/approve",
  protect,
  authorize("admin"),
  upload.fields([
    { name: "passportPhoto", maxCount: 1 },
    { name: "depositProof", maxCount: 1 },
  ]),
  approveCandidate,
);
router.put(
  "/:id/admin-update",
  protect,
  authorize("admin"),
  upload.fields([
    { name: "passportPhoto", maxCount: 1 },
    { name: "depositProof", maxCount: 1 },
  ]),
  updateAdminFields,
);

// Employee self-service routes
router.put("/:id/accept-contract", protect, acceptContract);
router.put(
  "/:id/update-profile", 
  protect, 
  upload.single("profileAvatar"), 
  updateOwnProfile
);
router.put("/:id/change-password", protect, changePassword);

router.delete("/:id", protect, authorize("admin"), deleteCandidate);

module.exports = router;
