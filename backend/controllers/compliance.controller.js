const Compliance = require("../models/Compliance");

// CREATE
exports.createCompliance = async (req, res) => {
  try {
    const compliance = await Compliance.create(req.body);

    res.status(201).json({
      success: true,
      data: compliance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
exports.getCompliances = async (req, res) => {
  const compliances = await Compliance.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    count: compliances.length,
    data: compliances,
  });
};

// GET ONE
exports.getCompliance = async (req, res) => {
  const compliance = await Compliance.findById(req.params.id);

  if (!compliance) {
    return res.status(404).json({
      success: false,
      message: "Compliance not found",
    });
  }

  res.json({
    success: true,
    data: compliance,
  });
};

// UPDATE
exports.updateCompliance = async (req, res) => {
  const compliance = await Compliance.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );

  if (!compliance) {
    return res.status(404).json({
      success: false,
      message: "Compliance not found",
    });
  }

  res.json({
    success: true,
    data: compliance,
  });
};

// DELETE
exports.deleteCompliance = async (req, res) => {
  const compliance = await Compliance.findByIdAndDelete(req.params.id);

  if (!compliance) {
    return res.status(404).json({
      success: false,
      message: "Compliance not found",
    });
  }

  res.json({
    success: true,
    message: "Compliance deleted successfully",
  });
};
