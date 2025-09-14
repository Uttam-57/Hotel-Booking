const mongoose = require("mongoose");
const Listing = require("../model/listing.js");
const initdata = require("./data.js");

mongoose.connect("mongodb+srv://db_user:1oGxrslgzDk3imdX@hotelbooking.xmp3drb.mongodb.net/?retryWrites=true&w=majority&appName=HotelBooking")
    .then(() => {
        console.log("Connected to MongoDB for initialization");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });


    
     
const initdb = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj , owner: "68c30ebb1a190feb3aefa2ed"}));
    await Listing.insertMany(initdata.data);
    console.log("Database initialized with sample data.");
};
initdb();