const express = require("express");
const router = express.Router();
const Listing = require("../model/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");



router.get("/", wrapAsync(async (req, res) => {
    const alllist = await Listing.find();
    res.render("listing.ejs", { alllist });
}));


router.get("/new", (req, res) => { // Route to render the form for creating a new listing
    res.render("new.ejs");
});
router.get("/:id", wrapAsync(async (req, res) => {  // Route to show a specific listing by ID
    const id = req.params.id;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    else {
        res.render("show.ejs", { listing });
    }
}));
router.get("/:id/edit", wrapAsync(async (req, res) => { // Route to render the form for editing a specific listing by ID
    const id = req.params.id;
    const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    res.render("edit.ejs", { listing });
}));

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    }
    next();
};
// Route to create a new listing
// This route handles the creation of a new listing by accepting POST requests
router.post("/", validateListing, wrapAsync(async (req, res) => {

    if (!req.body) {
        throw new ExpressError(400, " data not provided");
    }
    const listing = new Listing(req.body);
    if (!listing.title || !listing.description || !listing.price || !listing.location || !listing.country) {
        throw new ExpressError(400, "All fields are required");
    }
    await listing.save();
    req.flash("success", "Listing created successfully");
    res.redirect(`/listings/${listing._id}`);
}));

router.put("/:id", wrapAsync(async (req, res) => { // Route to update a specific listing by ID
    const id = req.params.id;

    const listing = new Listing(req.body);

    if (!listing.title || !listing.description || !listing.price || !listing.location || !listing.country) {

        throw new ExpressError(400, "All fields are required");
    }
    let listing1 = await Listing.findByIdAndUpdate(id, req.body);
    res.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
}));
// Route to delete a listing
router.delete("/:id", wrapAsync(async (req, res) => {
    const id = req.params.id;
    console.log("Deleting listing with ID:", id);
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    console.log("Listing deleted successfully");
    res.redirect("/listings");
}));

module.exports = router;