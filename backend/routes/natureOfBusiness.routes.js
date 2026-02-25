const router = require("express").Router();
const NatureOfBusiness = require("../models/NatureOfBusiness");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, authorize("admin", "advisor"), async (req, res) => {
  const list = await NatureOfBusiness.find().sort({
    businessGroup: 1,
  });
  res.json(list);
});

router.get("/:id", protect, authorize("admin"), async (req, res) => {
  const item = await NatureOfBusiness.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

router.post("/", protect, authorize("admin"), async (req, res) => {
  const created = await NatureOfBusiness.create(req.body);
  res.status(201).json(created);
});

router.put("/:id", protect, authorize("admin"), async (req, res) => {
  const updated = await NatureOfBusiness.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  res.json(updated);
});

router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  await NatureOfBusiness.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
