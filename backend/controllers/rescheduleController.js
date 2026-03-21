const RescheduleRequest = require("../models/RescheduleRequest");
const Candidate = require("../models/Candidate");

// POST /api/reschedule — Accountant creates a reschedule request
exports.createRequest = async (req, res) => {
  try {
    const {
      clientId, originalDay, originalFromTime, originalToTime, originalDate, reason,
      proposedDay, proposedFromTime, proposedToTime
    } = req.body;
    const accountantId = req.user._id;

    // Look up accountant's reporting senior
    const accountant = await Candidate.findById(accountantId).select("adminInfo.reportingAuthority");
    let seniorId = null;

    if (accountant?.adminInfo?.reportingAuthority) {
      // reportingAuthority stores employee ID string, find the Candidate with that employeeId
      const senior = await Candidate.findOne({
        "adminInfo.employeeId": accountant.adminInfo.reportingAuthority,
      }).select("_id");
      seniorId = senior?._id || null;
    }

    const request = new RescheduleRequest({
      client: clientId,
      requestedBy: accountantId,
      seniorId,
      originalDay,
      originalFromTime,
      originalToTime,
      originalDate: originalDate || null,
      accountantProposedDay: proposedDay,
      accountantProposedFromTime: proposedFromTime,
      accountantProposedToTime: proposedToTime,
      reason,
      status: "pending_senior",
    });

    await request.save();

    const populated = await RescheduleRequest.findById(request._id)
      .populate("client", "entityName contactName")
      .populate("requestedBy", "personalInfo.firstName personalInfo.lastName adminInfo.employeeId")
      .populate("seniorId", "personalInfo.firstName personalInfo.lastName adminInfo.employeeId");

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    console.error("createRescheduleRequest error:", err);
    res.status(500).json({ success: false, message: "Failed to create reschedule request", error: err.message });
  }
};

// GET /api/reschedule/my-requests — Accountant sees own requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await RescheduleRequest.find({ requestedBy: req.user._id })
      .populate("client", "entityName contactName")
      .populate("seniorId", "personalInfo.firstName personalInfo.lastName")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error("getMyRequests error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch requests" });
  }
};

// GET /api/reschedule/pending — Senior sees pending requests from their team
exports.getPendingForSenior = async (req, res) => {
  try {
    const requests = await RescheduleRequest.find({
      seniorId: req.user._id,
      status: { $in: ["pending_senior", "approved_by_senior", "sent_to_client"] },
    })
      .populate("client", "entityName contactName")
      .populate("requestedBy", "personalInfo.firstName personalInfo.lastName adminInfo.employeeId")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error("getPendingForSenior error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch pending requests" });
  }
};

// PUT /api/reschedule/:id/senior-action — Senior approves or rejects
exports.seniorAction = async (req, res) => {
  try {
    const { action, note, selectedDay } = req.body; // action: 'approved' | 'rejected', selectedDay: { day, fromTime, toTime }
    const request = await RescheduleRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    // Verify this employee is the assigned senior
    if (request.seniorId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    request.seniorResponse = {
      action,
      note: note || "",
      respondedAt: new Date(),
    };

    if (action === "approved") {
      // If Senior updated the day during dialogue with client, or use Accountant's proposal
      request.clientSelectedDay = selectedDay || {
        day: request.accountantProposedDay,
        fromTime: request.accountantProposedFromTime,
        toTime: request.accountantProposedToTime
      };
      request.status = "completed";
    } else {
      request.status = "rejected_by_senior";
    }

    await request.save();

    const populated = await RescheduleRequest.findById(request._id)
      .populate("client", "entityName contactName")
      .populate("requestedBy", "personalInfo.firstName personalInfo.lastName");

    res.json({ success: true, data: populated });
  } catch (err) {
    console.error("seniorAction error:", err);
    res.status(500).json({ success: false, message: "Failed to process action" });
  }
};

// PUT /api/reschedule/:id/send-to-client — Senior sends proposed days to client
exports.sendToClient = async (req, res) => {
  try {
    const { proposedDays } = req.body; // array of { day, fromTime, toTime }
    const request = await RescheduleRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (request.seniorId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    request.clientProposedDays = proposedDays;
    request.status = "sent_to_client";
    await request.save();

    res.json({ success: true, data: request });
  } catch (err) {
    console.error("sendToClient error:", err);
    res.status(500).json({ success: false, message: "Failed to send to client" });
  }
};

// PUT /api/reschedule/:id/client-respond — Client picks a day
exports.clientRespond = async (req, res) => {
  try {
    const { selectedDay } = req.body; // { day, fromTime, toTime }
    const request = await RescheduleRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    request.clientSelectedDay = selectedDay;
    request.status = "completed";
    await request.save();

    res.json({ success: true, data: request });
  } catch (err) {
    console.error("clientRespond error:", err);
    res.status(500).json({ success: false, message: "Failed to record client response" });
  }
};

// GET /api/reschedule/client/:clientId — All requests for a specific client
exports.getByClient = async (req, res) => {
  try {
    const requests = await RescheduleRequest.find({ client: req.params.clientId })
      .populate("requestedBy", "personalInfo.firstName personalInfo.lastName adminInfo.employeeId")
      .populate("seniorId", "personalInfo.firstName personalInfo.lastName")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error("getByClient error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch client requests" });
  }
};
