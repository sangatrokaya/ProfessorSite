import express from "express";
import {
  getPublicProfile,
  upsertProfile,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getPublicProfile);
router.put("/", protect, upsertProfile);

export default router;
