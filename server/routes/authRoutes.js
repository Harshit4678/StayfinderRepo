import express from "express";
import {
  sendOtp,
  verifyOtp,
  completeProfile,
  adminLogin,
  googleLogin,
  emailRegister,
  emailLogin,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/complete-profile", verifyToken, completeProfile);
router.post("/admin-login", adminLogin);
router.post("/google-login", googleLogin);
router.post("/email-register", emailRegister);
router.post("/email-login", emailLogin);

export default router;
