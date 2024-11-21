import express from "express";
import {
  getAllSavings,
  getDeleteSaving,
  getSaving,
  postAddSaving,
  postUpdateSaving,
} from "../controllers/savings.js";

const router = express.Router();

router.post("/add", postAddSaving);
router.post("/update/:id", postUpdateSaving);
router.get("/delete/:id", getDeleteSaving);
router.get("/all", getAllSavings);
router.get("/:id", getSaving);

export default router;
