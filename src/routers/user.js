import express from "express";
import { getAllInfo, getDeleteUser, getUser, postUpdateUser } from "../controllers/user.js";

const router = express.Router();
router.get("/profile",getUser);
router.post("/update",postUpdateUser);
router.get("/delete",getDeleteUser);
router.get("/all-info",getAllInfo);

export default router;