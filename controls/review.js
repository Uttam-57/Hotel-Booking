const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");

module.exports.createReview = async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    const review = new Review(req.body.review);
    if (!review.rating || !review.content ) {
        throw new ExpressError(400, "Rating and comment are required");
    }
    review.listing = listing._id; // Associate the review with the listing
    review.username = req.user._id; // Set the username to the logged-in user's ID
    await review.save();
    listing.reviews.push(review);
    await listing.save();
    req.flash("success", "Review created successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroy = async (req, res) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findById(id);

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
    console.log("Review deleted  successfully with ID:", reviewId);

    res.redirect(`/listings/${id}`);

};