import express from "express";
import {
  getAllSavingGoals,
  getDeleteSavingGoal,
  getSavingGoal,
  postAddSavingGoal,
  postUpdateSavingGoal,
} from "../controllers/savinggoals.js";
import { getSucceeded } from "../controllers/budgets.js";

const router = express.Router();

router.post("/add", postAddSavingGoal);
router.post("/update/:id", postUpdateSavingGoal);
router.get("/delete/:id", getDeleteSavingGoal);
router.get("/all", getAllSavingGoals);
router.get("/:id", getSavingGoal);
router.get("/completed/:id",getSucceeded);

export default router;