import User from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";

export const postAddBudget = responseHandler(async (req, res, next) => {
  const { category, totalAmount, date, description, amountSpent } = req.body;
  // console.log(req.user);
  const userId = req.user.userId;
  // console.log(req.user);
  // console.log(userId)
  try {
    // let id=req.user.userId;
    // console.log("id: ",id);
    let user = await User.findOne({ _id: userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't add, User not found");
    }
    let budgetId = Date.now().toString();
    let newBudget = {
      budgetId,
      description,
      totalAmount,
      date,
      category,
      amountSpent,
    };
    user.budgets.unshift(newBudget);
    await user.save();
    res.status(200).json({
      message: "Budget added successfully",
      budgets: user.budgets,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't add budget"
    );
  }
});

export const postUpdateBudget = responseHandler(async (req, res, next) => {
  const { category, totalAmount, date, description, amountSpent} = req.body;
  // console.log(req.body);
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't update, User not found");
    }
    let index = user["budgets"].findIndex((item) => item.budgetId === id);
    if (index == -1) {
      throw new ErrorHandler(401, "Can't update, Budget not found");
    }
    if (category) user["budgets"][index].category = category;
    if (totalAmount) user["budgets"][index].totalAmount = totalAmount;
    if (date) user["budgets"][index].date = date;
    if (description) user["budgets"][index].description = description;
    if (amountSpent) user["budgets"][index].amountSpent = amountSpent;
    // console.log(user);
    await user.save();
    res.status(200).json({
      message: "Budget updated successfully",
      budgets: user.budgets,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't update budget now"
    );
  }
});

export const getDeleteBudget = responseHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't delete, User not found");
    }
    let index = user["budgets"].findIndex((item) => item.budgetId === id);
    if (index == -1) {
      throw new ErrorHandler(401, "Can't delete, Budget not found");
    }
    user["budgets"].splice(index, 1);
    await user.save();
    res.status(200).json({
      message: "Budget deleted succesfully",
      budgets: user.budgets,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't delete budget"
    );
  }
});

export const getAllBudgets = responseHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't get budgets, User not found");
    }
    res.status(200).json({
      message: "Budgets fetched successfully",
      budgets: user.budgets,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't fetch budget right now"
    );
  }
});

export const getBudget = responseHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't get budget, User not found");
    }
    let index = user["budgets"].findIndex((item) => item.budgetId === id);
    res.status(200).json({
      message: "Budget fetched successfully",
      budget: user.budgets[index],
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't fetch budget right now"
    );
  }
});

export const getSucceeded = responseHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't change budget succeeded status, User not found");
    }
    let index = user["budgets"].findIndex((item) => item.budgetId === id);
    if (index == -1) {
      throw new ErrorHandler(404, "Can't change budget succeeded status, Budget not found");
    }
    user["budgets"][index].active = false;
    await user.save();
    res.status(200).json({
      message: "Budget succeeded successfully",
      budgets: user.budgets,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't change budget succeeded status right now"
    );
  }
});
