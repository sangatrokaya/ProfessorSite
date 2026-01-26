import express from "express";
import {
  createPaper,
  deletePaper,
  getPapers,
  updatePaper,
} from "../controllers/paperController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getPapers).post(protect, createPaper);
router.route("/:id").delete(protect, deletePaper).put(protect, updatePaper);

export default router;
