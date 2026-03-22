import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["passenger","driver"],
        required:true
    },
    profilePic:{
        type:String
    },
    otp:{
        type:Number
    },
    otpExpires:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

export default mongoose.model("User",userSchema);