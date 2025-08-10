import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

export const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { listingId } = req.params;

  try {
    // Debug logs
    console.log("UserId:", req.userId);
    console.log("ListingId:", listingId);
    // Check if the user booked the listing
    const hasBooked = await Booking.findOne({
      user: req.userId,
      listing: listingId,
      status: "confirmed", // optional if you're tracking booking status
    });
    console.log("HasBooked:", hasBooked);

    if (!hasBooked) {
      return res
        .status(403)
        .json({ msg: "You can only review booked listings" });
    }

    // Prevent multiple reviews by same user
    const existing = await Review.findOne({
      user: req.userId,
      listing: listingId,
    });
    if (existing) {
      return res.status(400).json({ msg: "You already reviewed this listing" });
    }

    const review = new Review({
      user: req.userId,
      listing: listingId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ msg: "Failed to post review", error: err.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      listing: req.params.listingId,
    }).populate("user", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch reviews" });
  }
};
