import express from "express";
import {
  createStyle,
  getStyles,
  updateStyle,
  deleteStyle,
} from "../controllers/styleController.js";

const router = express.Router();

router.post("/", createStyle);
router.get("/", getStyles);
router.patch("/:id", updateStyle);
router.delete("/:id", deleteStyle);

export default router;
