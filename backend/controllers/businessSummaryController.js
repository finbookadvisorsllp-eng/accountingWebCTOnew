// controllers/businessSummaryController.js
const ClientBusinessSummary = require("../models/ClientBusinessSummary");

// @desc    Create or Update Monthly Business Summary
// @route   POST /api/business-summary
// @access  Private
exports.createOrUpdateSummary = async (req, res) => {
  try {
    const {
      client_id,
      year,
      month,
      sales_total,
      sales_product_taxable,
      sales_service_taxable,
      purchase_rm,
      purchase_trading,
      purchase_pm,
      purchase_consumables,
    } = req.body;

    // Validate required fields
    if (!client_id || !year || !month) {
      return res.status(400).json({ status: "fail", message: "Client ID, Year, and Month are required" });
    }

    // Convert to numbers and validate (must be positive)
    const parseNumber = (val) => {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    const s_total = parseNumber(sales_total);
    const s_product = parseNumber(sales_product_taxable);
    const s_service = parseNumber(sales_service_taxable);
    const p_rm = parseNumber(purchase_rm);
    const p_trading = parseNumber(purchase_trading);
    const p_pm = parseNumber(purchase_pm);
    const p_consumable = parseNumber(purchase_consumables);

    if (s_total < 0 || s_product < 0 || s_service < 0 || p_rm < 0 || p_trading < 0 || p_pm < 0 || p_consumable < 0) {
      return res.status(400).json({ status: "fail", message: "Monetary values must be positive numbers" });
    }

    // Calculations
    const s_taxable = s_product + s_service;
    const p_total = p_rm + p_trading + p_pm + p_consumable;

    const summaryData = {
      client: client_id,
      year,
      month,
      sales_total: s_total,
      sales_product_taxable: s_product,
      sales_service_taxable: s_service,
      sales_total_taxable: s_taxable,
      purchase_total: p_total,
      purchase_rm: p_rm,
      purchase_trading: p_trading,
      purchase_pm: p_pm,
      purchase_consumables: p_consumable,
      createdBy: req.user._id, // Set from auth middleware
    };

    // Update if exists, else create
    const summary = await ClientBusinessSummary.findOneAndUpdate(
      { client: client_id, year, month },
      summaryData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: "Business summary saved successfully",
      data: summary,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Get All Monthly Data for a Client in a Specific Year
// @route   GET /api/business-summary/:clientId?year=YYYY
// @access  Private
exports.getSummariesByYear = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ status: "fail", message: "Year query parameter is required" });
    }

    const summaries = await ClientBusinessSummary.find({ client: clientId, year });

    res.status(200).json({
      status: "success",
      data: summaries,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Get Single Month Data for a Client
// @route   GET /api/business-summary/:clientId/:year/:month
// @access  Private
exports.getSingleSummary = async (req, res) => {
  try {
    const { clientId, year, month } = req.params;

    const summary = await ClientBusinessSummary.findOne({ client: clientId, year, month });

    res.status(200).json({
      status: "success",
      data: summary || null, // Return null instead of 404 if not found, to help frontend pre-fill
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
