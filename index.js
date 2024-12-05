import mongoose from "mongoose";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import loginRouter from "./src/routers/login.js";
import expenseRouter from "./src/routers/expenses.js";
import budgetRouter from "./src/routers/budgets.js";
import savingRouter from "./src/routers/savings.js";
import userRouter from "./src/routers/user.js";
import goalRouter from "./src/routers/goals.js";
import { verifyJWT } from "./src/utils/verifyJWT.js";
// import User from "./models/user.js";
// import MongoClient from "mongodb";

const url=process.env.DB_URL
// const client=new MongoClient(url);
// const dbName='pfpdb';
// let db=undefined


const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.CORS_ORIGINS,
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "4kb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "4kb" }));
app.use(express.static("public")); // To store the information that front end might provide

app.use(cookieParser());

app.use("/", loginRouter);
app.use("/user", verifyJWT, userRouter);
app.use("/expenses", verifyJWT, expenseRouter);
app.use("/budgets", verifyJWT, budgetRouter);
app.use("/savings", verifyJWT, savingRouter);
app.use("/saving-goals", verifyJWT, goalRouter);


mongoose
  .connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
  .then(() => {
    app.listen(PORT, () => {
      console.log("http://localhost:" + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
