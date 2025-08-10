import Listing from "../models/Listing.js";
import User from "../models/User.js";

// Get all listings
export const getAllListings = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, guests } = req.query;

    let filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" }; // case-insensitive search
    }

    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = parseInt(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = parseInt(maxPrice);
    }

    if (guests) {
      filter.maxGuests = { $gte: parseInt(guests) }; // You can store maxGuests in Listing model
    }

    const listings = await Listing.find(filter).populate("host", "name email");
    res.json(listings);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch listings" });
  }
};

// Get single listing by ID
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "host",
      "name email"
    );
    if (!listing) return res.status(404).json({ msg: "Listing not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch listing" });
  }
};

// Create new listing (host only)
export const createListing = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // req.user comes from verifyToken
    if (!user || (user.role !== "host" && user.role !== "admin")) {
      return res.status(403).json({ msg: "Only hosts can create listings" });
    }

    // Blocked host check
    if (user.role === "host" && user.isBlocked) {
      return res.status(403).json({
        msg: "Your services have been stopped by StayFinder Admin. Kindly contact support for further assistance.",
      });
    }

    const listing = new Listing({
      ...req.body,
      host: req.user.id,
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to create listing", error: err.message });
  }
};

// Get all listings created by a host
export const getListingsByHost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role === "host" && user.isBlocked) {
      return res.status(403).json({
        msg: "Your services have been stopped by StayFinder Admin. Kindly contact support for further assistance.",
      });
    }
    const listings = await Listing.find({ host: req.params.hostId });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching host listings" });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: "Listing not found" });

    // ✅ Only host or admin can edit
    if (listing.host.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Not authorized to edit this listing" });
    }

    // Blocked host cannot edit
    if (req.user.role === "host") {
      const user = await User.findById(req.user.id);
      if (user.isBlocked) {
        return res.status(403).json({ msg: "Host blocked or not authorized" });
      }
    }

    Object.assign(listing, req.body);
    await listing.save();

    res.json(listing);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update listing" });
  }
};
