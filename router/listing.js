const express = require("express");
const router = express.Router();
const Listing = require("../model/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLogedin, listingOwner, validateListing } = require("../middleware.js"); // Import the isLogedin middleware
const listingController = require("../controls/listing.js");
const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

// Route to create a new listing
router.get("/new",
    isLogedin,
    listingController.renderNewForm);


router.route("/") // roter.route to chain different methods
    // Route to get all listings
    .get(wrapAsync(listingController.index))
    .post(
        isLogedin,
        upload.single('image'), // 'image' is the name of the file input field in the form
        validateListing,
        wrapAsync(listingController.createListing)); // Create a new listing

// Route for final search results
router.get("/search", wrapAsync(listingController.searchListings));

// Route for autocomplete suggestions
router.get("/suggestions", listingController.getSuggestions);

router.route("/:id")
    .get(wrapAsync(listingController.showListing)) // Get a specific listing by ID
    .put(
        isLogedin,
        listingOwner,
        upload.single('image'),
        wrapAsync(listingController.updateListing)) // Update a specific listing by ID
    .delete(isLogedin, listingOwner, wrapAsync(listingController.destroy)); // Delete a specific listing by ID


// editing routes
router.get("/:id/edit", isLogedin, listingOwner, wrapAsync(listingController.renderEditForm));
// In your listings router file


module.exports = router;