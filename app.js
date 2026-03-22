import express from "express";
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser";
import profileRouter from "./routes/profile.js";
import ridesRouter from "./routes/rides.js";
import bookingRouter from "./routes/booking.js";
import path from "path";
import { fileURLToPath } from "url";
import globalAuth from "./middleware/globalAuth.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "uploads")));
app.set("view engine", "ejs");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalAuth);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/rides", ridesRouter);
app.use("/bookings", bookingRouter);


app.get("/", (req, res) => {
    res.render("home");
})



export default app;