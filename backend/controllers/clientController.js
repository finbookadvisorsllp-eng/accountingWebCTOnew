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

exports.createClient = async (req, res) => {
  try {
    const payload = req.body;

    // create clientId and password
    const clientId = genClientId();
    const plainPassword = "client@123";
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
    // Do NOT include passwordHash in response explicitly
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
    const updates = req.body;
    const client = await Client.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).populate(
      "entityType natureOfBusiness empAssign groupCompany complianceStatus taskApplicability.taskId",
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
