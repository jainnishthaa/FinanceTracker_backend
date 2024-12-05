import express from "express";
import { getLogout, postLogin, postSignup } from "../controllers/login.js";
import upload from "../middleware/multer.js";

const router = express.Router();
router.post('/signup',upload.single('image'), postSignup);
router.post('/login', postLogin);
router.get('/logout',getLogout);
router.get('/hello',(req,res)=>{
    res.send("Hello");
})
export default router;