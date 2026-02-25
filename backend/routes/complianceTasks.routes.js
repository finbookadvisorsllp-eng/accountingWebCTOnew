const router = require("express").Router();
const ComplianceTask = require("../models/ComplianceTask");
const { protect, authorize } = require("../middleware/auth");

// // STATS
// router.get(
//   "/stats",
//   protect,
//   authorize("admin", "advisor"),
//   async (req, res) => {
//     const total = await ComplianceTask.countDocuments();
//     const withDesc = await ComplianceTask.countDocuments({
//       description: { $ne: "" },
//     });
//     const withoutDesc = total - withDesc;

//     const latest = await ComplianceTask.findOne()
//       .sort({ createdAt: -1 })
//       .select("taskName createdAt");

//     res.json({
//       total,
//       withDesc,
//       withoutDesc,
//       latest,
//     });
//   },
// );

// VIEW ALL
router.get("/", protect, authorize("admin", "advisor"), async (req, res) => {
  const list = await ComplianceTask.find().sort({ taskName: 1 });
  res.json(list);
});

// GET ONE
router.get("/:id", protect, authorize("admin"), async (req, res) => {
  const task = await ComplianceTask.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Not found" });
  res.json(task);
});

// CREATE
router.post("/", protect, authorize("admin"), async (req, res) => {
  const created = await ComplianceTask.create({
    taskName: req.body.taskName,
    description: req.body.description,
  });
  res.status(201).json(created);
});

// UPDATE
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  const updated = await ComplianceTask.findByIdAndUpdate(
    req.params.id,
    {
      taskName: req.body.taskName,
      description: req.body.description,
    },
    { new: true },
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  await ComplianceTask.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
