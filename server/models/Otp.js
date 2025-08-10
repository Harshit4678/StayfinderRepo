import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    mobile: String,
    code: String,
    expiresAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
