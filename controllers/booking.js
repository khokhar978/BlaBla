import Bookings from "../models/Bookings.js";
import Rides from "../models/Ride.js";

export async function createBooking(req,res){
    console.log(req.body,req.user);
    const {seatsBooked}=req.body;
    const ride=await Rides.findById(req.params.id);
    if(!ride||ride.availableSeats<seatsBooked)return res.redirect("/rides/"+req.params.id);
    if(ride.driver._id==req.user.id){
        return res.status(400,{status:false,error:"cannot book own ride"});
    }
    const created=await Bookings.create({
        ride:ride._id,
        driver:ride.driver,
        passenger:req.user.id,
        seatsBooked,
        paymentStatus:false
    })
    if(created){
        ride.availableSeats=ride.availableSeats-seatsBooked; 
        await ride.save();
        res.status(200).json({success:true});
    }
}
export async function getMyBookings(req,res){
    try {
        const myBookings = await Bookings.find({ passenger: req.user.id })
            .populate("ride") 
            .populate("driver", "name profilePicture")
            .sort({ createdAt: -1 });

        res.render("bookings/my_bookings", {user:req.user, bookings: myBookings, error: null });

    } catch (err) {
        console.error(err);
        res.render("bookings/my_bookings", { bookings: [], error: "Failed to load bookings." });
    }
}
export async function cancelBooking(req,res){
    try{
        const booking=await Bookings.findById(req.params.id)
            .populate("ride")
            .populate("passenger","_id");
        booking.ride.availableSeats=booking.ride.availableSeats+booking.seatsBooked;
        booking.status="cancelled";
        if(booking.passenger._id==req.user.id){
            await booking.ride.save();
            await booking.save();
            
        } 
        res.redirect(`/bookings/my`);
    }catch(err){
        console.log(err);
        res.redirect("/");
    }
}
export async function confirmPayment(req, res) {
    try {
        const booking = await Bookings.findById(req.params.id).populate("ride");
        
        if (!booking) return res.redirect("/profile");

        // SECURITY CHECK: Ensure the person clicking confirm is actually the driver of this ride!
        if (booking.ride.driver.toString() === req.user.id) {
            booking.paymentStatus = true;
            booking.status = "confirmed"; // Upgrades status from 'pending' to 'confirmed'
            await booking.save();
        }
        
        // Redirect the driver back to the ride details page so they see the green "Paid" text
        res.redirect(`/rides/${booking.ride._id}`);
        
    } catch (error) {
        console.error("Error confirming payment:", error);
        res.redirect("/rides/myRides");
    }
}