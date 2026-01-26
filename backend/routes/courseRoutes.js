import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "../controllers/courseController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getCourses).post(protect, createCourse);
router.route("/:id").put(protect, updateCourse).delete(protect, deleteCourse);

export default router;
