import express from "express";
import {sendLoginPage,sendSignupPage,verifyCredentials,createUser,verifyEmail, logoutUser, resendOtp, getForgotPasswordPage, sendPasswordResetOtp, resetPassword} from "../controllers/auth.js"
const router=express.Router();


router.get("/login",sendLoginPage);
router.get("/signup",sendSignupPage);

router.post("/login",verifyCredentials);
router.post("/signup",createUser);

router.post("/verify",verifyEmail);
router.post("/resend-otp", resendOtp);

router.get("/logout",logoutUser);

router.get("/forgot-password", getForgotPasswordPage);
router.post("/forgot-password", sendPasswordResetOtp);
router.post("/reset-password", resetPassword);





export default router;