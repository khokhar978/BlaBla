import Users from "../models/User.js";


export async function showProfile(req,res){
    const user=await Users.findById(req.user.id);
    if(!user){
        res.clearCookie("token");
        return res.redirect("/auth/login");
    }
    res.render("profile/view",{user:user});
}

export async function showEditProfilePage(req,res){
    const user=await Users.findById(req.user.id);
    if(!user){
        res.clearCookie("token");
        return res.redirect("/auth/login");
    }
    res.render("profile/edit",{error:null,success:null,user:user});
}

export async function updateProfile(req,res){
    const saved=await Users.updateOne({_id:req.user.id},{
        name:req.body.name,
        profilePic:req.file.filename||null
    })
    console.log(req.file.filename);
    console.log(req.body);
    res.redirect(302,"/profile");
}