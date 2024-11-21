import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String, // cloudinary url
      required: true,
    },
    refreshToken: {
      type: String,
    },
    expenses: [
      {
        expenseId: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
      },
    ],
    budgets: [
      {
        budgetId: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        totalAmount: {
          type: Number,
          required: true,
        },
        amountSpent: {
          type: Number,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        expenseId: [],
        active: {
          type: Boolean,
          default: true,
        },
      },
    ],
    savings: [
      {
        savingId: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
      },
    ],
    savingGoals: [
      {
        goalId: {
          type: String,
          required: true,
        },
        goalAmt: {
          type: Number,
          required: true,
        },
        amountSaved: {
          type: Number,
          default: 0,
        },
        targetDate: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        category: {
          type: String,
          required: true,
        },
        savingId:[],
        active: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  const user = this;

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.REFRESH_TOKEN_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      username: this.username,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);
export default User;
