import User from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";

export const postAddSavingGoal = responseHandler(async (req, res, next) => {
  const { goalAmt, amountSaved, targetDate, description, category } = req.body;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't add, User not found");
    }
    let goalId = Date.now().toString();
    let newSavingGoal = {
      goalId,
      goalAmt,
      amountSaved,
      targetDate,
      description,
      category,
    };
    user.savingGoals.unshift(newSavingGoal);
    await user.save();
    res.status(200).json({
      message: "Saving goal added succesfully",
      savingGoals: user.savingGoals,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't add saving goal"
    );
  }
});

export const postUpdateSavingGoal = responseHandler(async (req, res, next) => {
  const { goalAmt, amountSaved, targetDate, description, category } = req.body;
  const { id } = req.params;
  // console.log(req.body);
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't update, User not found");
    }
    let index = user["savingGoals"].findIndex((item) => item.goalId === id);
    if (index == -1) {
      throw new ErrorHandler(404, "Can't update, Saving goal not found");
    }
    if (goalAmt) user["savingGoals"][index].goalAmt = goalAmt;
    if (amountSaved) user["savingGoals"][index].amountSaved = amountSaved;
    if (targetDate) user["savingGoals"][index].targetDate = targetDate;
    if (description) user["savingGoals"][index].description = description;
    if (category) user["savingGoals"][index].category = category;
    await user.save();
    res.status(200).json({
      message: "Saving goal updated succesfully",
      savingGoals: user.savingGoals,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't update saving goal"
    );
  }
});

export const getDeleteSavingGoal = responseHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't delete, User not found");
    }
    let index = user["savingGoals"].findIndex((item) => item.goalId === id);
    if (index == -1) {
      throw new ErrorHandler(404, "Can't delete, Saving goal not found");
    }
    user["savingGoals"].splice(index, 1);
    await user.save();
    res.status(200).jason({
      message: "Saving goal deleted succesfully",
      savingGoals: user.savingGoals,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't delete saving goal right now"
    );
  }
});

export const getAllSavingGoals = responseHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't get saving goals, User not found");
    }
    res.status(200).json({
      message: "Saving Goals fetched successfully",
      savingGoals: user.savingGoals,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't fetch saving goals right now"
    );
  }
});

export const getSavingGoal = responseHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't get saving goal, User not found");
    }
    let index = user["savingGoals"].findIndex((item) => item.goalId === id);
    if (index == -1) {
      throw new ErrorHandler(
        404,
        "Can't get saving goal, Saving goal not found"
      );
    }
    res.status(200).json({
      message: "Saving goal fetched successfully",
      savingGoal: user.savingGoals[index],
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't fetch saving goal right now"
    );
  }
});

export const getSucceeded = responseHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(
        401,
        "Can't change saving goal succeeded status, User not found"
      );
    }
    let index = user["savingGoals"].findIndex((item) => item.goalId === id);
    if (index == -1) {
      throw new ErrorHandler(
        401,
        "Can't change saving goal succeeded status, Saving goal not found"
      );
    }
    user["savingGoals"][index].active = false;
    await user.save();
    res.status(200).json({
      message: "Saving goal succeeded successfully",
      savingGoals: user.savingGoals,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't change saving goal succeeded status right now"
    );
  }
});
