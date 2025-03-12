import express from "express";
import {
  getStyleRankings,
  createStyle,
  getStyles,
  updateStyle,
  deleteStyle,
  getStyleDetail,
  getStyleById,
} from "../controllers/styleController.js";

const router = express.Router();

router.get("/rankings", getStyleRankings);
router.post("/", createStyle);
router.get("/", getStyles);
router.patch("/:id", updateStyle);
router.delete("/:id", deleteStyle);
router.get("/:id", getStyleById);
router.get("/:id", getStyleDetail);

export default router;
