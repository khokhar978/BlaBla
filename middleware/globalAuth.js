import jwt from "jsonwebtoken";
import Users from "../models/User.js";

const globalAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWTSECRET);
            const user = await Users.findById(decoded.id).select("-password -otp");
            res.locals.user = user || null;
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
};

export default globalAuth;
