const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");

const { isLogedin ,reviewOwner , validateReview} = require("../middleware.js"); // Import the isLogedin middleware

const reviewController = require("../controls/review.js");

// Middleware to validate review data
// Route to create a new review for a listing
// This route handles the creation of a new review by accepting POST requests

router.post("/", isLogedin, validateReview, wrapAsync(reviewController.createReview));


// Route to delete a review
router.delete("/:reviewId", isLogedin,reviewOwner , wrapAsync(reviewController.destroy))

module.exports = router;