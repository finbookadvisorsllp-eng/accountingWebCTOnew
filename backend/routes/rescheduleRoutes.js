const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/rescheduleController");
const { protect, authorize } = require("../middleware/auth");

// Accountant creates a reschedule request
router.post("/", protect, authorize("employee"), ctrl.createRequest);

// Accountant sees own requests
router.get("/my-requests", protect, authorize("employee"), ctrl.getMyRequests);

// Senior sees pending requests from their team
router.get("/pending", protect, authorize("employee"), ctrl.getPendingForSenior);

// Senior approves or rejects
router.put("/:id/senior-action", protect, authorize("employee"), ctrl.seniorAction);

// Senior sends proposed days to client
router.put("/:id/send-to-client", protect, authorize("employee"), ctrl.sendToClient);

// Client picks a day
router.put("/:id/client-respond", protect, authorize("admin", "employee", "client"), ctrl.clientRespond);

// All requests for a specific client
router.get("/client/:clientId", protect, authorize("employee", "admin", "client"), ctrl.getByClient);

module.exports = router;
