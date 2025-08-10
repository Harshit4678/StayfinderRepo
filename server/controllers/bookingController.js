import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;

    // 1. Listing exist karti hai?
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ msg: "Listing not found" });

    // 2. Host apni listing book na kare
    if (String(listing.host) === String(req.user.id)) {
      return res.status(403).json({ msg: "You can't book your own listing" });
    }

    // 3. Overlapping booking check
    const existing = await Booking.find({
      listing: listingId,
      $or: [
        {
          checkIn: { $lte: checkOut },
          checkOut: { $gte: checkIn },
        },
      ],
    });

    if (existing.length > 0) {
      return res.status(400).json({
        msg: "Dates already booked",
        reason: "Selected dates overlap with an existing booking.",
      });
    }

    // 4. Price calculate karo
    const days = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = listing.pricePerNight * days;

    // 5. Booking create karo
    const booking = new Booking({
      listing: listing._id,
      user: req.user.id,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    });

    await booking.save();
    res.status(201).json({ msg: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ msg: "Booking failed", error: err.message });
  }
};
// Get bookings for current user
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("listing", "title images location pricePerNight")
      .sort({ checkIn: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch bookings" });
  }
};

// Get bookings for all listings created by current host
export const getBookingsForHost = async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user.id }).select("_id");
    const listingIds = listings.map((listing) => listing._id);

    const bookings = await Booking.find({ listing: { $in: listingIds } })
      .populate("listing", "title images")
      .populate("user", "name email");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch host bookings" });
  }
};

export const getBookedDates = async (req, res) => {
  try {
    const bookings = await Booking.find({ listing: req.params.listingId });

    const dates = bookings.flatMap((b) => {
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      const dateArray = [];

      while (start <= end) {
        dateArray.push(new Date(start));
        start.setDate(start.getDate() + 1);
      }

      return dateArray;
    });

    res.json(dates);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch booked dates" });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId }).populate(
      "listing",
      "title location images pricePerNight"
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch your bookings" });
  }
};
