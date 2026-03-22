import jwt from "jsonwebtoken";

export default function authenticateUser(req,res,next){
    const token=req.cookies.token;

    if(!token){
        return res.redirect("/auth/login");
    }

    try{
        req.user=jwt.verify(token,process.env.JWTSECRET);
        next();
    }catch(err){
        res.clearCookie("token");
        res.redirect("/auth/login");
    }
}