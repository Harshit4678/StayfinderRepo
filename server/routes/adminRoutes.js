import express from "express";
import {
  adminLogin,
  getAllHosts,
  toggleHostBlockStatus,
  toggleListingStatus,
  sendEmailToHost,
} from "../controllers/adminController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/hosts", verifyToken, getAllHosts);
router.patch("/hosts/:id/block-toggle", verifyToken, toggleHostBlockStatus);
router.patch("/listings/:id/toggle", verifyToken, toggleListingStatus);
router.post("/email-host", verifyToken, sendEmailToHost);

export default router;
