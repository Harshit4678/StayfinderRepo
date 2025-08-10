import express from "express";
import { becomeHost } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to become a host
router.patch("/become-host", verifyToken, becomeHost);

export default router;
