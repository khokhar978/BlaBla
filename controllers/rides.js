import Bookings from "../models/Bookings.js";
import Rides from "../models/Ride.js";

export async function sendCreateRidePage(req,res){
    res.render("rides/create");
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
            sourceCoords: {
                lat: parseFloat(req.body.sourceLat),
                lng: parseFloat(req.body.sourceLng)
            },
            destinationCoords: {
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
    res.render("rides/my_rides",{rides,error:null});
}

export async function showAllRides(req, res) {
    try {
        let queryFilter = {
            date: { $gte: new Date() },
            availableSeats: { $gt: 0 },
            status: "scheduled"
        };
        if (req.query.source) {
            queryFilter.source = { $regex: req.query.source, $options: "i" };
        }
        
        if (req.query.destination) {
            queryFilter.destination = { $regex: req.query.destination, $options: "i" };
        }
        
        if (req.query.seats) {
            queryFilter.availableSeats = { $gte: parseInt(req.query.seats) };
        }
        
        if (req.query.date) {
            const searchDate = new Date(req.query.date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(nextDay.getDate() + 1);
            queryFilter.date = { 
                $gte: searchDate, 
                $lt: nextDay 
            };
        }
        const rides = await Rides.find(queryFilter)
            .populate("driver", "name profilePic")
            .sort({ date: 1 });

        res.render("rides/list", { rides, error: null, query: req.query || {} });

    } catch (error) {
        console.error("Search error:", error);
        res.render("rides/list", { rides: [], error: "Search failed.", query: req.query || {} });
    }
}

export async function getRideDetails(req, res) {
    try {
        const ride = await Rides.findById(req.params.id)
        .populate("driver", "name profilePic bio");
        if (!ride) return res.redirect("/rides/search");

        let passengers = [];
        if (req.user && req.user.id === ride.driver._id.toString()) {
            passengers = await Bookings.find({ ride: ride._id })
                .populate("passenger", "name profilePic");
        }
        res.render("rides/details", { ride, passengers, error: null });
    } catch (error) {
        console.error("Error fetching ride details:", error);
        res.redirect("/rides/search");
    }
}

export async function cancelRide(req, res) {
    try {
        const rideId = req.params.id;
        const driverId = req.user.id;


        const ride = await Rides.findOne({ _id: rideId, driver: driverId });

        if (!ride) {
            return res.status(404).send("Ride not found or you are unauthorized to cancel it.");
        }


        ride.status = "cancelled";
        ride.availableSeats = 0; 
        await ride.save();


        await Bookings.updateMany(
            { ride: rideId },
            { $set: { status: "cancelled" } }
        );


        res.redirect("/rides/myRides");

    } catch (error) {
        console.error("Error cancelling ride:", error);
        res.redirect("/rides/myRides");
    }
}