const mongoose = require('mongoose');
const Candidate = require('./backend/models/Candidate');
require('dotenv').config({ path: './backend/.env' });

async function check() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/accounting"; 
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    const candidates = await Candidate.find({ status: { $in: ["APPROVED", "ACTIVE"] } });
    console.log(`Found ${candidates.length} approved/active candidates`);

    candidates.forEach(c => {
      console.log(`ID: ${c._id}`);
      console.log(`Name: ${c.personalInfo?.firstName} ${c.personalInfo?.lastName}`);
      console.log(`Designation: ${c.adminInfo?.designation}`);
      console.log(`EmployeeId: ${c.adminInfo?.employeeId}`);
      console.log(`Status: ${c.status}`);
      console.log('---');
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
