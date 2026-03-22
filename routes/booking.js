import express from "express";
import authenticateUser from "../middleware/authentication.js";
import { cancelBooking, confirmPayment, createBooking, getMyBookings } from "../controllers/booking.js";

const router=express.Router();

router.post("/create/:id",authenticateUser,createBooking);
router.get("/my",authenticateUser,getMyBookings);
router.post("/cancel/:id",authenticateUser,cancelBooking);
router.post("/confirm-payment/:id",authenticateUser,confirmPayment);


export default router;