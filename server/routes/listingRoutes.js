import express from "express";
import {
  getAllListings,
  getListingById,
  createListing,
  getListingsByHost,
  updateListing,
} from "../controllers/listingController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllListings); // Public
router.get("/host/:hostId", verifyToken, getListingsByHost); // Host listings
router.get("/:id", getListingById); // Public

router.post("/", verifyToken, createListing); // Host-only
router.put("/:id", verifyToken, updateListing);

export default router;
