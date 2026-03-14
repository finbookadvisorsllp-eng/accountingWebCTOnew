const Attendance = require("../models/Attendance");

// ─── Helper: get today's date at midnight (UTC-aligned to local day) ───
function getToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// ─── Helper: compute total minutes ───
function diffMinutes(start, end) {
  return Math.round((end - start) / 60000);
}

// ═══════════════════════════════════════
// OFFICE ATTENDANCE
// ═══════════════════════════════════════

// POST /api/attendance/office/check-in
exports.officeCheckIn = async (req, res) => {
  try {
    const employeeId = req.user._id;
    if (!employeeId) {
      return res.status(401).json({ message: "Invalid user session" });
    }

    const today = getToday();
    const { latitude, longitude, notes } = req.body;

    // Prevent duplicate check-in
    const existing = await Attendance.findOne({
      employee: employeeId,
      type: "office",
      date: today,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already checked in today",
        data: existing,
      });
    }

    const checkInTime = new Date();
    // Threshold for late check-in: 11:10 AM local time
    const threshold = new Date(checkInTime);
    threshold.setHours(11, 10, 0, 0);

    const status = checkInTime.getTime() > threshold.getTime() ? "late" : "checked-in";

    const record = await Attendance.create({
      employee: employeeId,
      type: "office",
      date: today,
      checkIn: checkInTime,
      status: status,
      notes: notes || "",
      location: {
        checkInLocation: {
          latitude: latitude || null,
          longitude: longitude || null,
        },
      },
    });

    res.status(201).json({ message: "Checked in successfully", data: record });
  } catch (err) {
    console.error("officeCheckIn error:", err);
    res.status(500).json({ 
      message: "Internal Server Error during check-in", 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// POST /api/attendance/office/check-out
exports.officeCheckOut = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const today = getToday();
    const { latitude, longitude, notes } = req.body;

    const record = await Attendance.findOne({
      employee: employeeId,
      type: "office",
      date: today,
      status: { $in: ["checked-in", "late"] },
    });

    if (!record) {
      return res.status(400).json({ message: "No active check-in found for today" });
    }

    const now = new Date();
    record.checkOut = now;
    record.totalMinutes = diffMinutes(record.checkIn, now);
    record.status = "checked-out";
    if (latitude) record.location.checkOutLocation = { latitude, longitude };
    if (notes) record.notes = (record.notes ? record.notes + " | " : "") + notes;

    await record.save();

    res.json({ message: "Checked out successfully", data: record });
  } catch (err) {
    console.error("officeCheckOut error:", err);
    res.status(500).json({ message: "Failed to check out" });
  }
};

// GET /api/attendance/office/today
exports.officeToday = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const today = getToday();

    // 1. Check for stale sessions (forgot to check out yesterday)
    const staleRecord = await Attendance.findOne({
      employee: employeeId,
      type: "office",
      date: { $lt: today },
      status: { $in: ["checked-in", "late"] },
    });

    let forgotCheckout = false;
    if (staleRecord) {
      // Auto-close stale record
      const autoCloseTime = new Date(staleRecord.checkIn);
      autoCloseTime.setHours(autoCloseTime.getHours() + 8); // Default 8 hours
      
      staleRecord.checkOut = autoCloseTime;
      staleRecord.totalMinutes = 480;
      staleRecord.status = "auto-closed";
      await staleRecord.save();
      forgotCheckout = true;
    }

    // 2. Get today's record
    const record = await Attendance.findOne({
      employee: employeeId,
      type: "office",
      date: today,
    });

    res.json({ data: record, forgotCheckout });
  } catch (err) {
    console.error("officeToday error:", err);
    res.status(500).json({ message: "Failed to get today's record" });
  }
};

// GET /api/attendance/office/history?month=3&year=2026
exports.officeHistory = async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1; // 1-indexed
    const year = parseInt(req.query.year) || now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59); // last day of month

    const records = await Attendance.find({
      employee: req.user._id,
      type: "office",
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    res.json({ data: records, month, year });
  } catch (err) {
    console.error("officeHistory error:", err);
    res.status(500).json({ message: "Failed to get attendance history" });
  }
};

// ═══════════════════════════════════════
// CLIENT VISIT ATTENDANCE
// ═══════════════════════════════════════

// POST /api/attendance/client/:clientId/check-in
exports.clientCheckIn = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const { clientId } = req.params;
    const today = getToday();
    const { latitude, longitude, notes } = req.body;

    const existing = await Attendance.findOne({
      employee: employeeId,
      type: "client",
      client: clientId,
      date: today,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already checked in for this client today",
        data: existing,
      });
    }

    const record = await Attendance.create({
      employee: employeeId,
      type: "client",
      client: clientId,
      date: today,
      checkIn: new Date(),
      status: "checked-in",
      notes: notes || "",
      location: {
        checkInLocation: {
          latitude: latitude || null,
          longitude: longitude || null,
        },
      },
    });

    res.status(201).json({ message: "Client visit check-in successful", data: record });
  } catch (err) {
    console.error("clientCheckIn error:", err);
    res.status(500).json({ message: "Failed to check in for client visit" });
  }
};

// POST /api/attendance/client/:clientId/check-out
exports.clientCheckOut = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const { clientId } = req.params;
    const today = getToday();
    const { latitude, longitude, notes } = req.body;

    // Use findOne without status: "checked-in" strictly, but look for the most recent one today
    const record = await Attendance.findOne({
      employee: employeeId,
      type: "client",
      client: clientId,
      date: today,
      status: "checked-in",
    });

    if (!record) {
      // Fallback: check if they checked in but status was "late" (though client visit doesn't have late yet)
      // or if they already checked out
      const alreadyDone = await Attendance.findOne({
        employee: employeeId,
        type: "client",
        client: clientId,
        date: today,
        status: "checked-out",
      });
      if (alreadyDone) {
         return res.status(400).json({ message: "Already checked out for this client today", data: alreadyDone });
      }
      return res.status(400).json({ message: "No active client check-in found for today" });
    }

    const now = new Date();
    record.checkOut = now;
    record.totalMinutes = diffMinutes(record.checkIn, now);
    record.status = "checked-out";
    if (latitude) record.location.checkOutLocation = { latitude, longitude };
    if (notes) record.notes = (record.notes ? record.notes + " | " : "") + notes;

    await record.save();

    res.json({ message: "Client visit check-out successful", data: record });
  } catch (err) {
    console.error("clientCheckOut error:", err);
    res.status(500).json({ message: "Failed to check out for client visit" });
  }
};

// GET /api/attendance/client/:clientId/history
exports.clientHistory = async (req, res) => {
  try {
    const records = await Attendance.find({
      employee: req.user._id,
      type: "client",
      client: req.params.clientId,
    })
      .sort({ date: -1 })
      .limit(30);

    res.json({ data: records });
  } catch (err) {
    console.error("clientHistory error:", err);
    res.status(500).json({ message: "Failed to get client visit history" });
  }
};

// ═══════════════════════════════════════
// MONTHLY SUMMARY
// ═══════════════════════════════════════

// GET /api/attendance/summary?month=3&year=2026
exports.getSummary = async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const officeRecords = await Attendance.find({
      employee: req.user._id,
      type: "office",
      date: { $gte: startDate, $lte: endDate },
    });

    const daysInMonth = new Date(year, month, 0).getDate();
    const today = now.getDate();
    const daysElapsed = month === now.getMonth() + 1 && year === now.getFullYear()
      ? today
      : daysInMonth;

    // Count weekdays (Mon-Sat) elapsed — exclude Sundays
    let workingDaysElapsed = 0;
    for (let d = 1; d <= daysElapsed; d++) {
      const day = new Date(year, month - 1, d).getDay(); // 0=Sun
      if (day !== 0) workingDaysElapsed++;
    }

    const daysPresent = officeRecords.length;
    const daysLate = officeRecords.filter(r => r.status === 'late').length;
    const daysMissed = Math.max(0, workingDaysElapsed - daysPresent);
    const totalHours = Math.round(
      officeRecords.reduce((sum, r) => sum + (r.totalMinutes || 0), 0) / 60
    );

    res.json({
      data: {
        month,
        year,
        daysInMonth,
        workingDaysElapsed,
        daysPresent,
        daysLate,
        daysMissed,
        totalHours,
      },
    });
  } catch (err) {
    console.error("getSummary error:", err);
    res.status(500).json({ message: "Failed to get attendance summary" });
  }
};
