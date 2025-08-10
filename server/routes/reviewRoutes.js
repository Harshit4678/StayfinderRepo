import express from "express";
import { addReview, getReviews } from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST review
router.post("/:listingId", verifyToken, addReview);

// GET all reviews for a listing
router.get("/:listingId", getReviews);

export default router;
