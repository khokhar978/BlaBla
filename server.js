import "dotenv/config";
// import { configDotenv } from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import dns from "dns";
// configDotenv();
dns.setServers(["8.8.8.8"]);

const PORT=process.env.PORT;


app.listen(PORT,()=>{
    console.log("Server started on "+PORT);
    connectDB();
})