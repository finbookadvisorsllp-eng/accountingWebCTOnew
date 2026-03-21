const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const Client = require("./models/Client");
const ClientPnLRecord = require("./models/ClientPnLRecord");
const ClientGSTLiability = require("./models/ClientGSTLiability");
const RescheduleRequest = require("./models/RescheduleRequest");
const Candidate = require("./models/Candidate");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  const client = await Client.findOne({ clientId: "CL-PXOIZ4" });
  if (!client) {
    console.log("Client not found");
    process.exit(1);
  }
  const clientId = client._id;
  console.log(`Found client: ${client.entityName} (${clientId})`);

  // Find a candidate to act as createdBy (any accountant)
  const accountant = await Candidate.findOne();
  if (!accountant) {
    console.log("No Accountant/Candidate found to assign as creator");
    process.exit(1);
  }

  // 1. Create Mock P&L for current year
  const currentYear = new Date().getFullYear().toString();
  await ClientPnLRecord.deleteMany({ client: clientId }); // Clear old
  
  const pnlItems = [
    { client: clientId, year: currentYear, type: "income", category: "Revenue", sub_category: "Sales", amount: 150000 },
    { client: clientId, year: currentYear, type: "income", category: "Revenue", sub_category: "Consulting", amount: 50000 },
    { client: clientId, year: currentYear, type: "expense", category: "Operating", sub_category: "Rent", amount: 30000 },
    { client: clientId, year: currentYear, type: "expense", category: "Operating", sub_category: "Salaries", amount: 80000 },
    { client: clientId, year: currentYear, type: "expense", category: "Tax", sub_category: "Professional Fees", amount: 10000 }
  ].map(item => ({ ...item, createdBy: accountant._id }));

  await ClientPnLRecord.insertMany(pnlItems);
  console.log("Created P&L Records");

  // 2. Create Mock GST Liability for trend chart (Jan to Mar)
  await ClientGSTLiability.deleteMany({ client: clientId });
  
  const gstItems = [
    { client: clientId, year: currentYear, month: "1", output_total: 18000, input_total: 12000, gst_payable: 6000 },
    { client: clientId, year: currentYear, month: "2", output_total: 22000, input_total: 15000, gst_payable: 7000 },
    { client: clientId, year: currentYear, month: "3", output_total: 25000, input_total: 12000, gst_payable: 13000 }
  ];
  await ClientGSTLiability.insertMany(gstItems.map(item => ({
    ...item,
    createdBy: accountant._id,
    output_cgst: item.output_total/2, output_sgst: item.output_total/2, input_cgst: item.input_total/2, input_sgst: item.input_total/2
  })));
  console.log("Created GST Records");

  // 3. Create mock Reschedule Request
  await RescheduleRequest.deleteMany({ client: clientId });
  if (accountant) {
    const resc = new RescheduleRequest({
      client: clientId,
      requestedBy: accountant._id,
      originalDay: "Monday",
      reason: "National Holiday and office remains closed",
      status: "sent_to_client",
      clientProposedDays: [
        { day: "Tuesday", fromTime: "11:00 AM", toTime: "01:00 PM" },
        { day: "Thursday", fromTime: "03:00 PM", toTime: "05:00 PM" }
      ]
    });
    await resc.save();
    console.log("Created Reschedule Request Trigger for banner tests");
  }

  console.log("Mock data inserted successfully!");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
