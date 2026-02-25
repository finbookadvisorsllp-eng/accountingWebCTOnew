const express = require("express");
const router = express.Router();
const EntityType = require("../models/EntityType");

// 🔥 USE YOUR EXISTING MIDDLEWARE
const { protect, authorize } = require("../middleware/auth");

const PAN_CODES = ["P", "F", "C", "G", "A", "H", "T"];

/**
 * @desc    Get all entity types
 * @route   GET /api/entity-types
 * @access  Private (admin, advisor – view only)
 */
router.get("/", protect, authorize("admin", "advisor"), async (req, res) => {
  const list = await EntityType.find().sort({ entityType: 1 });
  res.json(list);
});

/**
 * @desc    Get single entity type
 * @route   GET /api/entity-types/:id
 * @access  Private (admin)
 */
router.get("/:id", protect, authorize("admin"), async (req, res) => {
  const item = await EntityType.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(item);
});

/**
 * @desc    Create entity type
 * @route   POST /api/entity-types
 * @access  Private (admin only)
 */
router.post("/", protect, authorize("admin"), async (req, res) => {
  const { entityType, ownership, applicableOwnership, panClassification } =
    req.body;

  if (!PAN_CODES.includes(panClassification)) {
    return res.status(400).json({ message: "Invalid PAN Classification" });
  }

  const exists = await EntityType.findOne({ entityType });
  if (exists) {
    return res.status(409).json({ message: "Entity Type already exists" });
  }

  const created = await EntityType.create({
    entityType,
    ownership,
    applicableOwnership,
    panClassification,
  });

  res.status(201).json(created);
});

/**
 * @desc    Update entity type
 * @route   PUT /api/entity-types/:id
 * @access  Private (admin only)
 */
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  const updated = await EntityType.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(updated);
});

/**
 * @desc    Delete entity type
 * @route   DELETE /api/entity-types/:id
 * @access  Private (admin only)
 */
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  await EntityType.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
