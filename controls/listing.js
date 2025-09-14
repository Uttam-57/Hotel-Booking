const Listing = require("../model/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const cloudinary = require('cloudinary').v2;


module.exports.index = async (req, res) => {
    console.log(req.user, "from listing.js in roter");
    const alllist = await Listing.find().populate("owner");
    res.render("./listings/listing.ejs", { alllist });
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res) => {// This route handles the creation of a new listing by accepting POST requests

    if (!req.body) {
        throw new ExpressError(400, " data not provided");
    }
    const listing = new Listing(req.body);
    if (!listing.title || !listing.description || !listing.price || !listing.location || !listing.country) {
        throw new ExpressError(400, "All fields are required");
    }
    listing.owner = req.user._id;
    if (req.file) {
        listing.image.url = req.file.path;
        listing.image.filename = req.file.filename;
    }
    await listing.save();
    req.flash("success", "Listing created successfully");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.showListing = async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews"
            , populate: { path: "username" }
        })
        .populate("owner");
    console.log(listing, "from listing.js in router");
    if (!listing) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    else {
        res.render("./listings/show.ejs", { listing });
    }
};

module.exports.renderEditForm = async (req, res) => { // Route to render the form for editing a specific listing by ID
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => { // Route to update a specific listing by ID
    const id = req.params.id;

    const listing = await Listing.findById(id);

    if (!listing.title || !listing.description || !listing.price || !listing.location || !listing.country) {

        throw new ExpressError(400, "All fields are required");
    }

    await Listing.findByIdAndUpdate(id, req.body);
    if (req.file) {
        const oldImageFilename = listing.image.filename;

        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };

        if (oldImageFilename) {
            await cloudinary.uploader.destroy(oldImageFilename);
        }
        await listing.save();

    }


    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroy = async (req, res) => {
    const id = req.params.id;
    console.log("Deleting listing with ID:", id);

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }

    // STEP 1: Delete the associated image from Cloudinary
    // The filename is the public_id
    await cloudinary.uploader.destroy(listing.image.filename);


    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    console.log("Listing deleted successfully");
    res.redirect("/listings");
};

// This function handles the FINAL search when the user hits Enter
module.exports.searchListings = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        const resultList = await Listing.find({});
        return res.redirect("/listings");
    }

    try {
        const searchResults = await Listing.aggregate([
            {
                $search: {
                    index: "default",
                    text: {
                        query: q,
                        path: ["title", "location", "country", "description"],
                        fuzzy: { maxEdits: 2 }
                    }
                }
            }
        ]);
        if (searchResults.length > 0) {

            // If we have results, render the main listings page 
            // and pass the searchResults to it.
            console.log("from searchListings in listing.js next is renderr result.ejs");
            res.render("./listings/result.ejs", { resultList: searchResults });
        } else {
            // If no results, flash an error message and redirect.
            req.flash("error", "No listings found for your search. Try another destination!");
            res.redirect("/listings");
        }
    } catch (e) {
        console.error("Search error:", e);
        res.status(500).json({ message: "Error performing search" });
    }
};

// This function provides AUTOCOMPLETE suggestions as the user types
module.exports.getSuggestions = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.json([]);
    }

    try {
        const suggestions = await Listing.aggregate([
            {
                $search: {
                    index: "default",
                    autocomplete: {
                        query: q,
                        path: "title",
                        fuzzy: { maxEdits: 1 },
                        tokenOrder: "sequential"
                    }
                }
            },
            { $limit: 5 },
            { $project: { _id: 0, title: 1 } }
        ]);
        res.json(suggestions);
    } catch (e) {
        console.error("Suggestion search error:", e);
        res.status(500).json({ message: "Error fetching suggestions" });
    }
};