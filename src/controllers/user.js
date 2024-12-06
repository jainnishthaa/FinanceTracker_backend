import User from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";

export const getUser = responseHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ _is: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "USer not found");
    }
    res.status(200).json({
      message: "User fetched successfully",
      user: user,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't fetch user right now"
    );
  }
});

export const postUpdateUser = responseHandler(async (req, res, next) => {
  const { name, email, username, password } = req.body;
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "User not found");
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (username) user.username = username;
    if (password) user.password = password;
    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      user: user,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't update user"
    );
  }
});

export const getDeleteUser = responseHandler(async (req, res, next) => {
  try {
    const result = await User.deleteOne({ _id: req.user.userId });
    if (!result) throw new ErrorHandler(404, "User not found");
    res.status(200).json({
      message: "User deleted successfully",
      user: null,
    });
  } catch (error) {
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't delete user right now"
    );
  }
});

export const getAllInfo = responseHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new ErrorHandler(401, "User not found");
    }
    const data = {
      expense: user.expenses[0],
      budget: user.budgets[0],
      savingGoal: user.savingGoals[0],
      saving: user.savings[0],
    };
    // console.log(data);
    res.status(200).json({
      message: "Info fetched successfully",
      data: data,
    });
  } catch (error) {
    console.log(error.message);
    throw new ErrorHandler(
      error.statusCode || 500,
      error.message || "Can't fetch info right now"
    );
  }
});
