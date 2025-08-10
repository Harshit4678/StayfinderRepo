import Otp from "../models/Otp.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = async (req, res) => {
  const { mobile } = req.body;
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.findOneAndDelete({ mobile });
  await Otp.create({ mobile, code, expiresAt });

  console.log(`OTP for ${mobile}: ${code}`);
  res.status(200).json({ msg: "OTP sent" });
};

export const verifyOtp = async (req, res) => {
  const { mobile, code } = req.body;
  const otpRecord = await Otp.findOne({ mobile, code });
  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    return res.status(400).json({ msg: "Invalid or expired OTP" });
  }

  let user = await User.findOne({ mobile });
  if (!user) {
    user = await User.create({
      mobile,
      provider: "mobile",
      isProfileComplete: false,
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  await Otp.deleteOne({ _id: otpRecord._id });

  res.status(200).json({ token, user });
};

export const completeProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, dob, mobile } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { name, email, dob, mobile, isProfileComplete: true },
    { new: true }
  );
  res.status(200).json({ user });
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, isAdmin: true });
  if (!user) return res.status(404).json({ msg: "Admin not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.status(200).json({ token, user });
};

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const googleRes = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );
    const { email, name, sub } = googleRes.data;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        provider: "google",
        isProfileComplete: false, // or false if you want to ask dob
      });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ user, token: jwtToken });
  } catch (err) {
    res.status(401).json({ msg: "Invalid Google Token" });
  }
};

export const emailRegister = async (req, res) => {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ msg: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashed,
    provider: "email",
    isProfileComplete: false,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ user, token });
};

// Login
export const emailLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Incorrect password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.json({ user, token });
};
