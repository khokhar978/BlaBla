import express from "express";
import { showEditProfilePage, showProfile, updateProfile } from "../controllers/profile.js";
import authenticateUser from "../middleware/authentication.js";
import upload from "../middleware/handleUploads.js";

const router=express.Router();

router.get("/",authenticateUser,showProfile);

router.get("/edit",authenticateUser,showEditProfilePage);

router.post("/edit",authenticateUser,upload.single("profilePicture"),updateProfile);





export default router;