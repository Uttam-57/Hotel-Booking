const mongoose = require("mongoose");
const Listing = require("../model/listing.js");
const initdata = require("./data.js");

mongoose.connect("mongodb://127.0.0.1:27017/HotelBooking")
    .then(() => {
        console.log("Connected to MongoDB for initialization");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });


    
     
const initdb = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj , owner: "68a73c22c9e4a3c28e8a5036"}));
    await Listing.insertMany(initdata.data);
    console.log("Database initialized with sample data.");
};
initdb();