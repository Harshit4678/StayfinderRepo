// 📁 server/scripts/createAdmin.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const existing = await User.findOne({ email: "admin@example.com" });
  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: hashedPassword,
    isAdmin: true,
    isProfileComplete: true,
    provider: "email",
  });

  console.log("✅ Admin created: admin@example.com / admin123");
  process.exit();
};

createAdmin();
