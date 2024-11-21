import express from "express";
import {
  getAllBudgets,
  getBudget,
  getDeleteBudget,
  getSucceeded,
  postAddBudget,
  postUpdateBudget,
} from "../controllers/budgets.js";

const router = express.Router();
router.post("/add", postAddBudget);
router.post("/update/:id", postUpdateBudget);
router.get("/delete/:id", getDeleteBudget);
router.get("/all", getAllBudgets);
router.get("/:id", getBudget);
router.get("/completed/:id",getSucceeded);

export default router;
