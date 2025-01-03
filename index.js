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

// const allowedOrigins = ['https://finance-tracker-frontend-nu.vercel.app','http://127.0.0.1:3000/'];
// const allowedOrigins = ['http://127.0.0.1:3000'];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true, // Allow credentials
//   })
// );
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000','https://finance-tracker-frontend-nu.vercel.app']; // Frontend origins

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from specific origins or requests without an origin (e.g., Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
  .connect(`mongodb+srv://nishthaa2003:nishthaa2000@financetracker.oawop.mongodb.net/?retryWrites=true&w=majority&appName=FinanceTracker`)
  .then(() => {
    app.listen(PORT, () => {
      console.log("http://localhost:" + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
