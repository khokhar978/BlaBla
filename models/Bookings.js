import mongoose from "mongoose";

const bookingSchema=mongoose.Schema({
    ride:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ride",
        required:true
    },
    passenger:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    driver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    seatsBooked:{
        type:Number,
        required:true,
        min:1
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
        default: 'pending'
    },
    paymentStatus:{
        type:Boolean,
        required:true,
        default:false
    }
},{
    timestamps:true
})

export default mongoose.model("Booking",bookingSchema);