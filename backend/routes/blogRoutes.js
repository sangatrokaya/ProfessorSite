import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogsAdmin,
  getBlogs,
} from "../controllers/blogController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getBlogs);

// Admin
router.get("/admin", protect, getAllBlogsAdmin);
router.post("/", protect, createBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
