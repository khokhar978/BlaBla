export default function authenticateUser(req, res, next) {
    if (!res.locals.user) {
        res.clearCookie("token");
        return res.redirect("/auth/login");
    }

    req.user = res.locals.user;
    next();
}