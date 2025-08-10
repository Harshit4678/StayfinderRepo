import express from "express";
import {
  createBooking,
  getBookedDates,
  getMyBookings,
  getBookingsForHost,
  getBookingsByUser,
} from "../controllers/bookingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/booked/:listingId", getBookedDates);
router.get("/my", verifyToken, getMyBookings);
router.get("/host", verifyToken, getBookingsForHost);
router.get("/my-bookings", verifyToken, getBookingsByUser);

export default router;
