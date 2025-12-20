import express from "express";
import {
  createVideo,
  deleteVideo,
  getAllVideosAdmin,
  getVideos,
} from "../controllers/videoController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getVideos);

// Admin
router.get("/admin", protect, getAllVideosAdmin);
router.post("/", protect, createVideo);
router.delete("/:id", protect, deleteVideo);

export default router;
