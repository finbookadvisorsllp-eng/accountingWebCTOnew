const Client = require("../models/Client");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");

// helper: generate brief clientId like CL-xxxx
function genClientId() {
  return `CL-${nanoid(6).toUpperCase()}`;
}
function genPassword(len = 10) {
  return nanoid(len);
}

/**
 * Convert empty strings to null for fields that should be ObjectId or null.
 * Also trim strings if needed.
 */

function sanitizePayload(payload) {
  const referenceFields = [
    "empAssign",
    "groupCompany",
    "entityType",
    "natureOfBusiness",
    "createdBy",
  ];
  const sanitized = { ...payload };
  for (let field of referenceFields) {
    if (sanitized[field] === "") {
      sanitized[field] = null;
    }
  }
  // Also handle arrays of ObjectIds (like complianceStatus) – remove empty strings
  if (Array.isArray(sanitized.complianceStatus)) {
    sanitized.complianceStatus = sanitized.complianceStatus.filter(
      (id) => id && id !== ""
    );
  }
  // taskApplicability: ensure taskId is not empty string
  if (Array.isArray(sanitized.taskApplicability)) {
    sanitized.taskApplicability = sanitized.taskApplicability.filter(
      (t) => t.taskId && t.taskId !== ""
    );
  }
  return sanitized;
}

exports.createClient = async (req, res) => {
  try {
    const payload = sanitizePayload(req.body);

    // create clientId and password
    const clientId = genClientId();
    const plainPassword = "client@123"; // or genPassword()
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    const client = new Client({
      ...payload,
      clientId,
      passwordHash,
      createdBy: req.user?._id || null,
    });

    await client.save();

    // Return generatedPassword once so admin can copy
    const out = client.toObject();
    out.generatedPassword = plainPassword;
    delete out.passwordHash;

    return res.status(201).json(out);
  } catch (err) {
    console.error("createClient error:", err);
    return res
      .status(500)
      .json({ message: "Failed to create client", error: err.message });
  }
};


exports.getClients = async (req, res) => {
  try {
    // support filters and pagination
    const { page = 1, limit = 25, status } = req.query;
    const q = {};
    if (status) q.status = status;
    // default: don't return dissolved? Up to you. For example exclude inactive from list if requested.
    const clients = await Client.find(q)
      .populate("entityType natureOfBusiness empAssign groupCompany")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const total = await Client.countDocuments(q);
    res.json({ data: clients, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
};

// GET /api/clients/my-clients — Employee sees only their assigned clients
exports.getMyClients = async (req, res) => {
  try {
    const employeeId = req.user._id; // Candidate ObjectId (set by auth middleware)
    const { status } = req.query;
    const q = { empAssign: employeeId };
    if (status) q.status = status;

    const clients = await Client.find(q)
      .populate("entityType natureOfBusiness")
      .sort({ createdAt: -1 });

    res.json({ data: clients, total: clients.length });
  } catch (err) {
    console.error("getMyClients error:", err);
    res.status(500).json({ message: "Failed to fetch your clients" });
  }
};

exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate(
      "entityType natureOfBusiness empAssign groupCompany complianceStatus taskApplicability.taskId",
    );
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch client" });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const updates = sanitizePayload(req.body);
    const client = await Client.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).populate(
      "entityType natureOfBusiness empAssign groupCompany complianceStatus taskApplicability.taskId"
    );
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update client" });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndRemove(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete client" });
  }
};

exports.assignAccountant = async (req, res) => {
  try {
    const { accountantId } = req.body;
    const client = await Client.findByIdAndUpdate(
      req.params.clientId,
      { empAssign: accountantId },
      { new: true },
    );
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to assign accountant" });
  }
};
