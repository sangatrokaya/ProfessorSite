import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourses,
} from "../controllers/courseController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getCourses).post(protect, createCourse);
router.route("/:id").delete(protect, deleteCourse);

export default router;
