import User from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";

export const postAddSaving = responseHandler(async (req, res, next) => {
  const { amount, date, description, category } = req.body;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't add, User not found");
    }
    let savingId = Date.now().toString();
    const newSaving = {
      savingId,
      amount,
      date,
      description,
      category,
    };
    let goalindex = user["savingGoals"].findIndex(
      (item) => item.active === true && item.category === category
    );
    if (goalindex == -1) {
      throw new ErrorHandler(404, "Saving Goal not found");
    }
    // console.log(goalindex);
    let goal = user["savingGoals"][goalindex];
    if (goal.goalAmt - goal.amountSaved < amount) {
      throw new ErrorHandler(400, "Extra saving");
    }
    user["savingGoals"][goalindex].amountSaved += (Number)(amount);
    user["savingGoals"][goalindex].savingId.push(savingId);
    user.savings.unshift(newSaving);
    await user.save();
    const savings = user.savings;
    let savgraph = [];
    savings.forEach((element) => {
      let ind = element.date.split("-")[1] - 1;
      if (savgraph[ind]) {
        savgraph[ind] += element.amount;
      } else {
        savgraph[ind] = element.amount;
      }
    });
    for (let index = 0; index < savgraph.length; index++) {
      if (!savgraph[index]) {
        savgraph[index] = 0;
      }
    }
    res.status(200).json({
      message: "Saving added succesfully",
      savings: user.savings,
      savgraph: savgraph,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't add saving"
    );
  }
});

export const postUpdateSaving = responseHandler(async (req, res, next) => {
  const { id } = req.params;
  const { amount, date, description, category } = req.body;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't update saving, User not found");
    }
    let index = user["savings"].findIndex((item) => item.savingId === id);
    if (index == -1) {
      throw new ErrorHandler(404, "Can't update saving, Saving not found");
    }
    if (amount){
      let prevAmt=user["savings"][index].amount;
      let goalindex=user["savingGoals"].findIndex(
        (item) => item.active === true && item.category === user["savings"][index].category
      );
      if(goalindex==-1){
        throw new ErrorHandler(404, "Goal not found");
      }
      user["savingGoals"][goalindex].amountSaved-=(Number)(prevAmt);
      user["savingGoals"][goalindex].amountSaved+=(Number)(amount);
      user["savings"][index].amount = amount;
    }
    if (date) user["savings"][index].date = date;
    if (description) user["savings"][index].description = description;
    if (category) user["savings"][index].category = category;
    await user.save();
    const savings = user.savings;
    let savgraph = [];
    savings.forEach((element) => {
      let ind = element.date.split("-")[1] - 1;
      if (savgraph[ind]) {
        savgraph[ind] += element.amount;
      } else {
        savgraph[ind] = element.amount;
      }
    });
    for (let index = 0; index < savgraph.length; index++) {
      if (!savgraph[index]) {
        savgraph[index] = 0;
      }
    }
    res.status(200).json({
      message: "Saving updated succesfully",
      savings: user.savings,
      savgraph:savgraph,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't update saving"
    );
  }
});

export const getDeleteSaving = responseHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't delete saving, User not found");
    }
    let index = user["savings"].findIndex((item) => item.savingId === id);
    if (index == -1) {
      throw new ErrorHandler(404, "Can't delete saving, Saving not found");
    }
    let goalindex=user["savingGoals"].findIndex(
      (item) => item.active===true && item.category===user["savings"][index].category
    )
    if(goalindex==-1){
      throw new ErrorHandler(400,"Goal not found");
    }
    user["savingGoals"][goalindex].amountSaved-=user["savings"][index].amount;
    user["savingGoals"][goalindex].savingId=user["savingGoals"][goalindex].savingId.filter(item=>item!=id);
    user["savings"].splice(index, 1);
    await user.save();
    const savings = user.savings;
    let savgraph = [];
    savings.forEach((element) => {
      let ind = element.date.split("-")[1] - 1;
      if (savgraph[ind]) {
        savgraph[ind] += element.amount;
      } else {
        savgraph[ind] = element.amount;
      }
    });
    for (let index = 0; index < savgraph.length; index++) {
      if (!savgraph[index]) {
        savgraph[index] = 0;
      }
    }
    res.status(200).json({
      message: "Saving deleted successfully",
      savings: user.savings,
      savgraph:savgraph,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't delete saving right now"
    );
  }
});

export const getAllSavings = responseHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't get savings, User not found");
    }
    const savings = user.savings;
    let savgraph = [];
    savings.forEach((element) => {
      let ind = element.date.split("-")[1] - 1;
      if (savgraph[ind]) {
        savgraph[ind] += element.amount;
      } else {
        savgraph[ind] = element.amount;
      }
    });
    for (let index = 0; index < savgraph.length; index++) {
      if (!savgraph[index]) {
        savgraph[index] = 0;
      }
    }
    res.status(200).json({
      message: "Savings retrieved successfully",
      savings: user.savings,
      savgraph:savgraph,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't get savings right now"
    );
  }
});

export const getSaving = responseHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "Can't get saving, User not found");
    }
    const index = user["savings"].findIndex((item) => item.savingId === id);
    if (index == -1) {
      throw new ErrorHandler(404, "Can't get saving, Saving not found");
    }
    res.status(200).json({
      message: "Saving fetched successfully",
      saving: user.savings[index],
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't fetch saving right now"
    );
  }
});
