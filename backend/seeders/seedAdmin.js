const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/accounting_advisory",
      {},
    );

    console.log("MongoDB Connected");

    // Check if admin exists
    const adminExists = await User.findOne({ email: "admin@accounting.com" });

    if (adminExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: "Admin",
      email: "admin@accounting.com",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin user created successfully");
    console.log("Email: admin@accounting.com");
    console.log("Password: admin123");
    console.log("Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedAdmin();
