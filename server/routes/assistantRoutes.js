import express from "express";
import { askAiAssistant } from "../controllers/assistantController.js";
const router = express.Router();

router.post("/ask", askAiAssistant);

export default router;
