import User from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";

export const postAddExpense = responseHandler(async (req, res, next) => {
  const { description, amount, date, category } = req.body;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't add, User not found");
    }
    let expenseId = Date.now().toString();
    let newExpense = {
      expenseId,
      description,
      amount,
      date,
      category,
    };
    let budgetindex = user["budgets"].findIndex(
      (item) => item.active === true && item.category === category
    );
    if (budgetindex == -1) {
      throw new ErrorHandler(404, "Budget not found");
    }
    console.log(budgetindex);
    let budget = user["budgets"][budgetindex];
    if (budget.totalAmount - budget.amountSpent < amount) {
      throw new ErrorHandler(400, "Insufficient Budget");
    }
    user["budgets"][budgetindex].amountSpent +=(Number)(amount) ;
    user["budgets"][budgetindex].expenseId.push(expenseId);
    user.expenses.unshift(newExpense);

    await user.save();
    const expenses = user.expenses;
    let expgraph = [];
    expenses.forEach((element) => {
      let ind = element.date.split("-")[1] - 1;
      if (expgraph[ind]) {
        expgraph[ind] += element.amount;
      } else {
        expgraph[ind] = element.amount;
      }
    });
    for (let index = 0; index < expgraph.length; index++) {
      if (!expgraph[index]) {
        expgraph[index] = 0;
      }
    }
    // console.log(expgraph);
    res.status(200).json({
      message: "Expense recorded successfully",
      expenses: user.expenses,
      expgraph: expgraph,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Cannot record expense"
    );
  }
});

export const postUpdateExpense = responseHandler(async (req, res, next) => {
  const { description, amount, date, category } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't update, User not found");
    }
    let index = user["expenses"].findIndex((item) => item.expenseId === id);
    if (index == -1) {
      throw new ErrorHandler(
        401,
        "Can't upadte, no such expense record awailable"
      );
    }
    if (description) user["expenses"][index].description = description;
    if (amount) {
      let prevAmt=user["expenses"][index].amount;
      let budgetindex = user["budgets"].findIndex(
        (item) => item.active === true && item.category === user["expenses"][index].category
      );
      if (budgetindex == -1) {
        throw new ErrorHandler(404, "Budget not found");
      }
      console.log(budgetindex);
      user["budgets"][budgetindex].amountSpent-=(Number)(prevAmt);
      user["budgets"][budgetindex].amountSpent += (Number)(amount);
      user["expenses"][index].amount=amount;
    }
    if (date) user["expenses"][index].date = date;
    if (category) user["expenses"][index].category = category;
    await user.save();
    const expenses = user.expenses;
    let expgraph = [];
    expenses.forEach((element) => {
      let ind = element.date.split("-")[1] - 1;
      if (expgraph[ind]) {
        expgraph[ind] += element.amount;
      } else {
        expgraph[ind] = element.amount;
      }
    });
    for (let index = 0; index < expgraph.length; index++) {
      if (!expgraph[index]) {
        expgraph[index] = 0;
      }
    }
    // console.log(expgraph);
    res.status(200).json({
      message: "Expense updated successfully",
      expenses: user.expenses,
      expgraph: expgraph,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "can't update expense record"
    );
  }
});

export const getDeleteExpense = responseHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't delete, User not found");
    }
    let index = user["expenses"].findIndex((item) => item.expenseId === id);
    if (index == -1) {
      throw new ErrorHandler(
        401,
        "Can't delete, no such expense record available"
      );
    }

    let budgetindex = user["budgets"].findIndex(
      (item) =>
        item.active === true &&
        item.category === user["expenses"][index].category
    );
    if (budgetindex == -1) {
      throw new ErrorHandler(404, "Budget not found");
    }
    user["budgets"][budgetindex].amountSpent -= user["expenses"][index].amount;
    user["budgets"][budgetindex].expenseId=user["budgets"][budgetindex].expenseId.filter(item=>item!=id);
    user["expenses"].splice(index, 1);
    await user.save();
    const expenses = user.expenses;
    let expgraph = [];
    expenses.forEach((element) => {
      let ind = element.date.split("-")[1] - 1;
      if (expgraph[ind]) {
        expgraph[ind] += element.amount;
      } else {
        expgraph[ind] = element.amount;
      }
    });
    for (let index = 0; index < expgraph.length; index++) {
      if (!expgraph[index]) {
        expgraph[index] = 0;
      }
    }
    // console.log(expgraph);
    res.status(200).json({
      message: "Expense deleted successfully",
      expenses: user.expenses,
      expgraph: expgraph,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "can't delete expense record"
    );
  }
});

export const getAllExpenses = responseHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't get expenses, User not found");
    }
    const expenses = user.expenses;
    let expgraph = [];
    expenses.forEach((element) => {
      let ind = element.date.split("-")[1] - 1;
      if (expgraph[ind]) {
        expgraph[ind] += element.amount;
      } else {
        expgraph[ind] = element.amount;
      }
    });
    for (let index = 0; index < expgraph.length; index++) {
      if (!expgraph[index]) {
        expgraph[index] = 0;
      }
    }
    // console.log(expgraph);
    res.status(200).json({
      message: "All expenses recorded successfully",
      expenses: user.expenses,
      expgraph: expgraph,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "can't access expenses right now"
    );
  }
});

export const getExpense = responseHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't get expense, User not found");
    }
    let index = user["expenses"].findIndex((item) => item.expenseId === id);
    if (index == -1) {
      throw new ErrorHandler(
        401,
        "Can't delete, no such expense record available"
      );
    }
    res.status(200).json({
      message: "Expense found successfully",
      expense: user.expenses[index],
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't get expense now"
    );
  }
});
