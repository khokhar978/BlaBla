import nodemailer from "nodemailer";

const Email=process.env.MAILUSERNAME;
const Password=process.env.MAILPASSWORD;
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:Email,
        pass:Password
    }
})

export async function sendOtpMail(mail,otp){

    const mailData={
        from: `"BlaBla Carpooling" `,
        to: mail,
        subject: "Verify Your Account - Your OTP Code",
        html: `
            <h2>Welcome to BlaBla Carpooling!</h2>
            <p>Your account verification code is: <strong>${otp}</strong></p>
            <p>This code will expire in 10 minutes.</p>
        `
    }
    try{
        const res=await transporter.sendMail(mailData);
        console.log(res.response);
    }catch(err){
        console.log("error sending otp to "+mail +err.message);
    }
}