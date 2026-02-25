const express = require("express");
const router = express.Router();

const {
  createCompliance,
  getCompliances,
  getCompliance,
  updateCompliance,
  deleteCompliance,
} = require("../controllers/compliance.controller");

const { protect, authorize } = require("../middleware/auth");

// Admin only
router.use(protect);
router.use(authorize("admin"));

router.route("/").get(getCompliances).post(createCompliance);

router
  .route("/:id")
  .get(getCompliance)
  .put(updateCompliance)
  .delete(deleteCompliance);

module.exports = router;
