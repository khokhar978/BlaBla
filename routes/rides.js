import express from "express";
import { createRide, getRideDetails, sendCreateRidePage, showAllRides, showOwnPublishedRides } from "../controllers/rides.js";
import authenticateUser from "../middleware/authentication.js";

const router=express.Router();


router.get("/create",authenticateUser,sendCreateRidePage);
router.post("/create",authenticateUser,createRide);
router.get("/myRides",authenticateUser,showOwnPublishedRides);
router.get("/search",showAllRides);
router.get("/:id",authenticateUser,getRideDetails);
router.get("/cancel/:id",authenticateUser,); 




export default router;