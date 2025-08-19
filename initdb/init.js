
const Listing = require("../model/listing.js");
const initdata = require("./data.js");

const initdb = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Database initialized with sample data.");
};
initdb();