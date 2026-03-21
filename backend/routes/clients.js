// routes/clients.js

const express = require("express");
const router = express.Router();
const clientCtrl = require("../controllers/clientController");
const { protect, authorize } = require("../middleware/auth");

/*
  CLIENT ROUTES
  Access Control:
  - Only Admin can create, update, delete
  - Admin + Assigned Employee can view
*/

// Create Client (Admin Only)
router.post("/", protect, authorize("admin"), clientCtrl.createClient);

// Get Clients assigned to logged-in employee
router.get(
  "/my-clients",
  protect,
  authorize("employee"),
  clientCtrl.getMyClients,
);

// Get All Clients (Admin)
router.get("/", protect, authorize("admin"), clientCtrl.getClients);

// Get Clients for team members (Employee - Manager/Senior)
router.get(
  "/team-clients",
  protect,
  authorize("employee"),
  clientCtrl.getTeamClients,
);

// Get Single Client (client can view own profile too)
router.get(
  "/:id",
  protect,
  authorize("admin", "employee", "client"),
  clientCtrl.getClient,
);

// Get Child Companies
router.get(
  "/:id/children",
  protect,
  authorize("admin", "employee", "client"),
  clientCtrl.getChildCompanies,
);


// Update Client (Admin Only)
router.put("/:id", protect, authorize("admin"), clientCtrl.updateClient);

// Delete Client (Admin Only)
router.delete("/:id", protect, authorize("admin"), clientCtrl.deleteClient);

// Assign Accountant / Employee (Admin Only)
router.put(
  "/:clientId/assign",
  protect,
  authorize("admin"),
  clientCtrl.assignAccountant,
);

module.exports = router;
