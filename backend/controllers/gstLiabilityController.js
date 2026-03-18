// controllers/gstLiabilityController.js
const ClientGSTLiability = require("../models/ClientGSTLiability");

// @desc    Create or Update Monthly GST Liability
// @route   POST /api/gst-liability
// @access  Private
exports.createOrUpdateLiability = async (req, res) => {
  try {
    const {
      client,
      year,
      month,
      // Output
      output_cgst, output_sgst, output_igst, output_cess,
      // Input
      input_cgst, input_sgst, input_igst, input_cess,
      // Carry Forward
      cf_cgst, cf_sgst, cf_igst, cf_cess
    } = req.body;

    // Validate required fields
    if (!client || !year || !month) {
      return res.status(400).json({ status: "fail", message: "Client, Year, and Month are required" });
    }

    const parseNumber = (val) => {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    // Parse and Validate outputs
    const o_cgst = parseNumber(output_cgst);
    const o_sgst = parseNumber(output_sgst);
    const o_igst = parseNumber(output_igst);
    const o_cess = parseNumber(output_cess);

    // Parse and Validate inputs
    const i_cgst = parseNumber(input_cgst);
    const i_sgst = parseNumber(input_sgst);
    const i_igst = parseNumber(input_igst);
    const i_cess = parseNumber(input_cess);

    // Parse and Validate carry forward
    const c_cgst = parseNumber(cf_cgst);
    const c_sgst = parseNumber(cf_sgst);
    const c_igst = parseNumber(cf_igst);
    const c_cess = parseNumber(cf_cess);

    // Check for negative values
    const allValues = [
      o_cgst, o_sgst, o_igst, o_cess,
      i_cgst, i_sgst, i_igst, i_cess,
      c_cgst, c_sgst, c_igst, c_cess
    ];

    if (allValues.some(val => val < 0)) {
      return res.status(400).json({ status: "fail", message: "Tax values must be non-negative" });
    }

    // SECTION 1: Output Total
    const output_total = o_cgst + o_sgst + o_igst + o_cess;

    // SECTION 2: Input Total
    const input_total = i_cgst + i_sgst + i_igst + i_cess;

    // SECTION 3: Carry Forward Total
    const cf_total = c_cgst + c_sgst + c_igst + c_cess;

    // CALCULATIONS
    const effective_input_gst = input_total + cf_total;
    let gst_payable = output_total - effective_input_gst;
    let next_month_carry_forward = 0;

    if (gst_payable > 0) {
      next_month_carry_forward = 0;
    } else {
      next_month_carry_forward = Math.abs(gst_payable);
      gst_payable = 0; // Set to 0 if negative
    }

    const liabilityData = {
      client,
      year,
      month,
      // Output
      output_cgst: o_cgst,
      output_sgst: o_sgst,
      output_igst: o_igst,
      output_cess: o_cess,
      output_total,
      // Input
      input_cgst: i_cgst,
      input_sgst: i_sgst,
      input_igst: i_igst,
      input_cess: i_cess,
      input_total,
      // Carry Forward
      cf_cgst: c_cgst,
      cf_sgst: c_sgst,
      cf_igst: c_igst,
      cf_cess: c_cess,
      cf_total,
      // Calculations
      gst_payable,
      next_month_carry_forward,
      createdBy: req.user._id,
    };

    // Upsert
    const liability = await ClientGSTLiability.findOneAndUpdate(
      { client, year, month },
      liabilityData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: "GST Liability saved successfully",
      data: liability,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Get All GST Liability for a Client in a Specific Year
// @route   GET /api/gst-liability/:clientId?year=YYYY
// @access  Private
exports.getLiabilitiesByYear = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ status: "fail", message: "Year query parameter is required" });
    }

    const liabilities = await ClientGSTLiability.find({ client: clientId, year });

    res.status(200).json({
      status: "success",
      data: liabilities,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Get Single Month GST Liability
// @route   GET /api/gst-liability/:clientId/:year/:month
// @access  Private
exports.getSingleLiability = async (req, res) => {
  try {
    const { clientId, year, month } = req.params;

    const liability = await ClientGSTLiability.findOne({ client: clientId, year, month });

    res.status(200).json({
      status: "success",
      data: liability || null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
