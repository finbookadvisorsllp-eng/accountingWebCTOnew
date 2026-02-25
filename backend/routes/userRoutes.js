const express = require("express");
const router = express.Router();
const {
  getAccountants,
  getAllUsers,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

// All user routes are protected and require admin role
router.use(protect);
router.use(authorize("admin"));

router.get("/accountants", getAccountants);
router.get("/", getAllUsers);

module.exports = router;
