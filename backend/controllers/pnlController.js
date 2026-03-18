// controllers/pnlController.js
const ClientPnLRecord = require("../models/ClientPnLRecord");

// @desc    Create or Update P&L Records (Bulk)
// @route   POST /api/pnl
// @access  Private
exports.createOrUpdatePnL = async (req, res) => {
  try {
    const { client, year, items } = req.body;

    if (!client || !year || !Array.isArray(items)) {
      return res.status(400).json({ status: "fail", message: "Client, Year, and Items array are required" });
    }

    const ops = items.map(item => {
      const amount = parseFloat(item.amount) || 0;
      if (amount < 0) {
        throw new Error(`Amount for ${item.category} -> ${item.sub_category} cannot be negative`);
      }

      return {
        updateOne: {
          filter: { 
            client, 
            year, 
            category: item.category, 
            sub_category: item.sub_category 
          },
          update: {
            $set: {
              type: item.type, // income or expense
              amount: amount,
              createdBy: req.user._id
            }
          },
          upsert: true
        }
      };
    });

    await ClientPnLRecord.bulkWrite(ops);

    res.status(200).json({
      status: "success",
      message: "P&L Records updated successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Get P&L Records for a Client in a Specific Year
// @route   GET /api/pnl/:clientId?year=YYYY
// @access  Private
exports.getPnLByYear = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ status: "fail", message: "Year query parameter is required" });
    }

    const records = await ClientPnLRecord.find({ client: clientId, year });

    res.status(200).json({
      status: "success",
      data: records,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Get P&L Summary (Totals)
// @route   GET /api/pnl/:clientId/summary?year=YYYY
// @access  Private
exports.getPnLSummary = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { year } = req.query;
    const mongoose = require("mongoose");

    if (!year) {
      return res.status(400).json({ status: "fail", message: "Year query parameter is required" });
    }

    const summary = await ClientPnLRecord.aggregate([
      {
        $match: {
          client: new mongoose.Types.ObjectId(clientId),
          year: year
        }
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    // Map aggregate results to final items
    let total_income = 0;
    let total_expenses = 0;

    summary.forEach(item => {
      if (item._id === "income") total_income = item.total;
      if (item._id === "expense") total_expenses = item.total;
    });

    const profit_or_loss = total_income - total_expenses;

    res.status(200).json({
      status: "success",
      data: {
        total_income,
        total_expenses,
        profit_or_loss
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
