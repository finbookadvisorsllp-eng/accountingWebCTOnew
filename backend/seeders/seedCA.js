const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const seedCA = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/ca_platform",
      {},
    );

    console.log("MongoDB Connected");

    // Check if CA exists
    const caExists = await User.findOne({ email: "admin@ca.com" });

    if (caExists) {
      console.log("CA user already exists");
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create CA user
    const ca = await User.create({
      name: "CA Admin",
      email: "admin@ca.com",
      password: "Admin@123",
      role: "CA",
      level: 0,
      parentId: null,
      status: "ACTIVE",
      mustChangePassword: false,
      isActive: true,
      employeeId: "CA001"
    });

    console.log("CA user created successfully");
    console.log("Email: admin@ca.com");
    console.log("Password: Admin@123");
    console.log("Role: CA");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedCA();
