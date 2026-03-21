const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const Client = require("./models/Client");

async function main() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/accounting");
  const clients = await Client.find({ scheduleType: "monthly" }).limit(5).lean();
  console.log("Monthly Clients Sample:", JSON.stringify(clients, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
