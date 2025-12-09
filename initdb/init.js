const mongoose = require("mongoose");
const Listing = require("../model/listing.js");
const initdata = require("./sampleData.js");
const dotenv = require("dotenv");

mongoose.connect(process.env.ATLAS_URI)
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