import Rides from "../models/Ride.js";

export async function sendCreateRidePage(req,res){
    res.render("rides/create",{user:req.user.id});
}
export async function createRide(req, res) {
    const { source, destination, date, departureTime, price, totalSeats } = req.body;
    try {
        const created = await Rides.create({
            driver: req.user.id,
            source,
            destination,
            availableSeats: totalSeats,
            price,
            departureTime,
            totalSeats: totalSeats,
            date: new Date(date),
            sourceCoordinates: {
                lat: parseFloat(req.body.sourceLat),
                lng: parseFloat(req.body.sourceLng)
            },
            destinationCoordinates: {
                lat: parseFloat(req.body.destLat),
                lng: parseFloat(req.body.destLng)
            }
        })
        console.log(req.body.sourceLat);
        res.status(200).json({ success: true, rideId: created._id });
    } catch (err) {
        res.status(500).send("Failed to save the ride to the database.");
    }
}

export async function showOwnPublishedRides(req,res){
    const rides=await Rides.find({driver:req.user.id});
    res.render("rides/my_rides",{user:req.user,rides,error:null});
}

export async function showAllRides(req,res) {
    const rides=await Rides.find({date:{$gte:new Date()}});
    res.render("rides/list",{user:req.user,rides,error:null,query:req.query||{}});
}

export async function getRideDetails(req,res){
    const ride=await Rides.findById(req.params.id);
    if(ride){
        return res.render("rides/details",{user:req.user,ride,error:null});
    }
    res.redirect("/rides/available");
}