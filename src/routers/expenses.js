import express from "express";
import { getAllExpenses, getDeleteExpense, getExpense, postAddExpense, postUpdateExpense } from "../controllers/expenses.js";

const router = express.Router();
router.post("/add",postAddExpense);
router.post("/update/:id",postUpdateExpense);
router.get("/delete/:id",getDeleteExpense);
router.get("/all",getAllExpenses);
router.get("/:id",getExpense);

export default router;