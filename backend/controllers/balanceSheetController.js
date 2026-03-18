// controllers/balanceSheetController.js
const ClientBalanceSheetRecord = require("../models/ClientBalanceSheetRecord");

// @desc    Create or Update Balance Sheet Records (Bulk)
// @route   POST /api/balance-sheet
// @access  Private
exports.createOrUpdateBS = async (req, res) => {
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
            type: item.type, // asset, liability, equity
            category: item.category, 
            sub_category: item.sub_category 
          },
          update: {
            $set: {
              amount: amount,
              createdBy: req.user._id
            }
          },
          upsert: true
        }
      };
    });

    await ClientBalanceSheetRecord.bulkWrite(ops);

    res.status(200).json({
      status: "success",
      message: "Balance Sheet Records updated successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Get Balance Sheet Records for a Client in a Specific Year
// @route   GET /api/balance-sheet/:clientId?year=YYYY
// @access  Private
exports.getBSByYear = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ status: "fail", message: "Year query parameter is required" });
    }

    const records = await ClientBalanceSheetRecord.find({ client: clientId, year });

    res.status(200).json({
      status: "success",
      data: records,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Get Balance Sheet Summary (Totals)
// @route   GET /api/balance-sheet/:clientId/summary?year=YYYY
// @access  Private
exports.getBSSummary = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { year } = req.query;
    const mongoose = require("mongoose");

    if (!year) {
      return res.status(400).json({ status: "fail", message: "Year query parameter is required" });
    }

    const summary = await ClientBalanceSheetRecord.aggregate([
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

    let total_assets = 0;
    let total_liabilities = 0;
    let total_equity = 0;

    summary.forEach(item => {
      if (item._id === "asset") total_assets = item.total;
      if (item._id === "liability") total_liabilities = item.total;
      if (item._id === "equity") total_equity = item.total;
    });

    // Formula: difference = Assets - (Liabilities + Equity)
    const balance_difference = total_assets - (total_liabilities + total_equity);

    res.status(200).json({
      status: "success",
      data: {
        total_assets,
        total_liabilities,
        total_equity,
        balance_difference
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
