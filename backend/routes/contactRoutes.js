import express from "express";
import { sendContactMessage } from "../controllers/contactController.js";

const router = express.Router();

// @desc Send contact message
// @route POST /api/contact
// @access Public
router.post("/", sendContactMessage);

export default router;
