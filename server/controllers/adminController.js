import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Listing from "../models/Listing.js";
import nodemailer from "nodemailer";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin) return res.status(401).json({ message: "Not authorized" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET
    );
    res.json({ token, admin });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};

export const getAllHosts = async (req, res) => {
  try {
    const hosts = await User.find({ role: "host" }).select("-password");
    res.json(hosts);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch hosts" });
  }
};

// Toggle block/unblock host
export const toggleHostBlockStatus = async (req, res) => {
  try {
    const hostId = req.params.id;

    const host = await User.findById(hostId);
    if (!host || host.role !== "host") {
      return res.status(404).json({ msg: "Host not found" });
    }

    host.isBlocked = !host.isBlocked;
    await host.save();

    res.json({
      msg: `Host ${host.isBlocked ? "blocked" : "unblocked"} successfully`,
      isBlocked: host.isBlocked,
    });
  } catch (err) {
    res.status(500).json({ msg: "Error updating host status" });
  }
};

export const toggleListingStatus = async (req, res) => {
  try {
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ msg: "Listing not found" });

    listing.isActive = !listing.isActive;
    await listing.save();

    res.json({
      msg: `Listing ${
        listing.isActive ? "activated" : "deactivated"
      } successfully`,
      isActive: listing.isActive,
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update listing status" });
  }
};

export const sendEmailToHost = async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"StayFinder Admin" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: "Email sent to host" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to send email" });
  }
};
