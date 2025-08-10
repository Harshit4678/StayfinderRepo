import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      validate: [(arr) => arr.length > 0, "At least one image is required"],
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guestCapacity: {
      type: Number,
      default: 2,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String], // e.g., ["WiFi", "AC", "Parking"]
    },
    availableDates: {
      type: [Date], // optional: available dates
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Listing", listingSchema);
