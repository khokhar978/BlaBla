import Users from "../models/User.js";


export async function showProfile(req,res){
    const user=await Users.findById(req.user.id);
    if(!user){
        res.clearCookie("token");
        return res.redirect("/auth/login");
    }
    res.render("profile/view");
}

export async function showEditProfilePage(req,res){
    const user=await Users.findById(req.user.id);
    if(!user){
        res.clearCookie("token");
        return res.redirect("/auth/login");
    }
    res.render("profile/edit",{error:null,success:null});
}

export async function updateProfile(req,res){
    const updateData = { name: req.body.name };
    if (req.file) {
        updateData.profilePic = req.file.filename;
    }
    const saved=await Users.updateOne({_id:req.user.id}, updateData);
    console.log(req.body);
    res.redirect(302,"/profile");
}