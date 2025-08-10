import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" }, // optional
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Review", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
