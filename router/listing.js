const express = require("express");
const router = express.Router();
const Listing = require("../model/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLogedin , listingOwner ,validateListing} = require("../middleware.js"); // Import the isLogedin middleware



router.get("/", wrapAsync(async (req, res) => {
    console.log(req.user,"from listing.js in roter");
    const alllist = await Listing.find();
    res.render("./listings/listing.ejs", { alllist });
}));

// Route to create a new listing
router.get("/new", isLogedin ,(req, res) => { // Route to render the form for creating a new listing
    res.render("./listings/new.ejs");
});
router.post("/", isLogedin ,validateListing, wrapAsync(async (req, res) => {// This route handles the creation of a new listing by accepting POST requests

    if (!req.body) {
        throw new ExpressError(400, " data not provided");
    }
    const listing = new Listing(req.body);
    if (!listing.title || !listing.description || !listing.price || !listing.location || !listing.country) {
        throw new ExpressError(400, "All fields are required");
    }
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "Listing created successfully");
    res.redirect(`/listings/${listing._id}`);
}));


// Route to show a specific listing by ID
router.get("/:id", wrapAsync(async (req, res) => {  
    const id = req.params.id;
    const listing = await Listing.findById(id)
    .populate({path: "reviews"
       , populate: { path: "username" }
    })
    .populate("owner");
    console.log(listing,"from listing.js in router");
    if (!listing) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    else {
        res.render("./listings/show.ejs", { listing });
    }
}));


// editing routes
router.get("/:id/edit",isLogedin ,listingOwner, wrapAsync(async (req, res) => { // Route to render the form for editing a specific listing by ID
    const id = req.params.id;
    const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
}));
router.put("/:id",isLogedin ,listingOwner, wrapAsync(async (req, res) => { // Route to update a specific listing by ID
    const id = req.params.id;

    const listing = new Listing(req.body);

    if (!listing.title || !listing.description || !listing.price || !listing.location || !listing.country) {

        throw new ExpressError(400, "All fields are required");
    }
    let listing1 = await Listing.findByIdAndUpdate(id, req.body);
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
}));



// Route to delete a listing
router.delete("/:id",isLogedin , listingOwner,wrapAsync(async (req, res) => {
    const id = req.params.id;
    console.log("Deleting listing with ID:", id);
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    console.log("Listing deleted successfully");
    res.redirect("/listings");
}));

module.exports = router;