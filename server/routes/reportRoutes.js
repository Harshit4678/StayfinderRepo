import express from "express";
import {
  createReport,
  getAllReports,
  updateReportStatus,
} from "../controllers/reportController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createReport);
router.get("/", verifyToken, getAllReports);
router.patch("/:reportId", verifyToken, updateReportStatus);

export default router;
