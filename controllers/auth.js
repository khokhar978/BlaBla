import Users from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpMail } from "../utils/sendMail.js";

export async function sendLoginPage(req,res){

    res.render("login",{error:null,data:null});


}
export async function sendSignupPage(req,res) {
    res.render("signup",{error:null,data:null});
}

export async function verifyCredentials(req,res) {
    const{email,password}=req.body;
    if(!email||!password){
        return res.render("login",{error:"all fields required.",data:null});
    }
    const user=await Users.findOne({email});
    let passMatch=false;
    if(user)passMatch=await bcrypt.compare(password,user.password);
    if(user&&passMatch){
        if(!user.isVerified){
            return res.render("verify",{error:null,email});
        }else{
            const token=jwt.sign({
                id:user._id
            },process.env.JWTSECRET,{expiresIn:"1d"});

            res.cookie("token",token,{
                httpOnly:true,
                maxAge:24*60*60*1000
            })

            return res.redirect(302,"/");
        }

    }else{
        res.render("login",{error:"Invalid credentials.",data:{email,password}});
    }

}

export async function createUser(req,res) {
    const {name,email,password,confirmPassword}=req.body;
    if(!name||!email||!password||!confirmPassword){
        return res.render("signup",{error:"Please fill all fields."});
    }
    if(password!=confirmPassword){
        return res.render("signup",{error:"Passwords do not match."});
    }
    if(await Users.findOne({email})){
        return res.render("signup",{error:"User already exists."})
    }else{
        const otp=generateOtp();

        const success=await Users.create({
            name,
            email,
            password:await bcrypt.hash(password,10),
            otp,
            otpExpires:new Date(Date.now() + 600000)
        })
        await sendOtpMail(email,otp);
        res.render("verify",{error:null,email});
    }

}

export async function verifyEmail(req,res) {
    const user=await Users.findOne({email:req.body.email});
    if(user){
        if(user.otp==req.body.otp&& Date.now()<=user.otpExpires){
            await Users.updateOne({_id:user._id},{isVerified:true, otp:null, otpExpires:null});
            return res.render("login",{error:null,data:null}); 
        }
    }
    res.render("verify",{error:"Invalid otp",email:req.body.email});
    
}
export async function logoutUser(req,res){
    res.clearCookie("token");
    res.redirect("/auth/login");
}
export async function resendOtp(req,res){
    const{email}=req.body;
    try{
        const user= await Users.findOne({email});
        if(!user){
            return res.render("signup",{error:"user not found please signup"});
        }
        if(user.isVerified){
            return res.redirect(302,"/auth/login");
        }
        const otp=generateOtp();
        user.otp=otp;
        user.otpExpires=new Date(Date.now()+600000);
        await user.save();
        sendOtpMail(user.email,otp);
        res.render("verify",{
            error:null,
            success:"A new otp has been sent to your mail",
            email
        })
    }catch (error) {
        console.log("Error resending OTP:", error);
        res.render("verify",{error:"Failed to resend OTP. Try again later.", email: email });
    }
}
export async function getForgotPasswordPage(req,res) {
    res.render("forgot-password",{error:null,success:null});
    
}
export async function sendPasswordResetOtp(req,res){
    const{email}=req.body;
    const user=await Users.findOne({email});
    if(!user){
        return res.render("forgot-password", { error: "If that email is registered, an OTP has been sent.", success: null });
    }
    const otp=generateOtp();
    user.otp=otp;
    user.otpExpires = new Date(Date.now()+600000);
    await user.save();

    sendOtpMail(email,otp);
    res.render("reset-password",{error:null,success:"OTP sent to your email.",email:email});
}
export async function resetPassword(req, res) {
    const{email,otp,newPassword,confirmNewPassword}=req.body;
    if(newPassword!==confirmNewPassword){
        return res.render("reset-password",{error:"Passwords do not match.",success:null,email: email});
    }
    const user=await Users.findOne({email});
    if(!user){
        return res.redirect("/auth/login");
    }
    if (user.otp==otp&&Date.now()<=user.otpExpires) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpires = null;
        user.isVerified = true; 
        await user.save();
        return res.render("login",{error:null,success:"Password reset success.",data:null}); 
    } else {
        return res.render("reset-password", { error: "Invalid or expired OTP.", success: null, email: email });
    }
}


function generateOtp() {
  const min = 1000;
  const max = 9999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}