import express from "express";
import {
  createPaper,
  deletePaper,
  getPapers,
} from "../controllers/paperController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getPapers).post(protect, createPaper);
router.route("/:id").delete(protect, deletePaper);

export default router;
