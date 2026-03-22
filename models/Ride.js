import mongoose from "mongoose";

const RideSchema =new mongoose.Schema({
    driver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    source:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    departureTime:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    totalSeats:{
        type:Number,
        required:true,
        min:1
    },
    availableSeats:{
        type:Number,
        required:true,
        min:0
    },
    status: { 
        type: String, 
        enum: ['scheduled', 'completed', 'cancelled'], 
        default: 'scheduled' 
    },
    sourceCoords: {
        lat: { 
            type: Number 
        },
        lng: { 
            type: Number 
        }
    },
    destinationCoords: {
        lat: { 
            type: Number 
        },
        lng: { 
            type: Number 
        }
    },
},{
    timestamps:true
})

export default mongoose.model("Ride",RideSchema);