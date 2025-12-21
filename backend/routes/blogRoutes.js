import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogsAdmin,
  getBlogs,
  getBlogById,
} from "../controllers/blogController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getBlogs);

// Admin
router.get("/admin", protect, getAllBlogsAdmin);

// Public - single blog (KEEP LAST)
router.get("/:id", getBlogById);

router.post("/", protect, createBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
