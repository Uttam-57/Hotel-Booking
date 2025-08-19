const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");


const Listing = require("../model/listing.js");
const Review = require("../model/review.js");


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    }
    next();
}
// Middleware to validate review data
// Route to create a new review for a listing
// This route handles the creation of a new review by accepting POST requests

router.post("/", validateReview, wrapAsync(async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    const review = new Review(req.body.review);
    if (!review.rating || !review.content || !review.username) {
        throw new ExpressError(400, "Rating and comment are required");
    }
    review.listing = listing._id; // Associate the review with the listing
    await review.save();
    listing.reviews.push(review);
    await listing.save();
    req.flash("success", "Review created successfully");
    res.redirect(`/listings/${id}`);
}));


// Route to delete a review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findById(id);

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
    console.log("Review deleted  successfully with ID:", reviewId);

    res.redirect(`/listings/${id}`);

}))

module.exports = router;