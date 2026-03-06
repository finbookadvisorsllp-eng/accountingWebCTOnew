/**
 * Generate prefix-based Employee IDs:
 *   Accountant       → FBA-001, FBA-002, ...
 *   Senior Accountant → FBS-001, FBS-002, ...
 *   Manager          → FBM-001, FBM-002, ...
 */
const DESIGNATION_PREFIX = {
  Accountant: "FBA",
  "Senior Accountant": "FBS",
  Manager: "FBM",
};

const generateEmployeeId = async (Candidate, designation) => {
  const prefix = DESIGNATION_PREFIX[designation];

  if (!prefix) {
    throw new Error(
      `Invalid designation "${designation}". Must be: Accountant, Senior Accountant, or Manager`,
    );
  }

  // Find the last employee ID with this prefix
  const lastCandidate = await Candidate.findOne({
    "adminInfo.employeeId": new RegExp(`^${prefix}-`),
  }).sort({ "adminInfo.employeeId": -1 });

  let nextNumber = 1;

  if (lastCandidate && lastCandidate.adminInfo.employeeId) {
    const numericPart = lastCandidate.adminInfo.employeeId.split("-")[1];
    nextNumber = parseInt(numericPart, 10) + 1;
  }

  // Pad with zeros — 3 digits (001, 002, etc.)
  const paddedNumber = String(nextNumber).padStart(3, "0");

  return `${prefix}-${paddedNumber}`;
};

module.exports = generateEmployeeId;
