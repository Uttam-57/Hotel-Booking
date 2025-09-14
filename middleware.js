const { reviewSchema , listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./model/listing.js");
const Review = require("./model/review.js");

// Middleware to check if user is logged in 
module.exports.isLogedin = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectURL = req.originalUrl; // Store the original URL to redirect after login
        req.flash("error", "You must be logged in to do that");
        return res.redirect("/login");
    }
    next();
}
// Middleware to check if the logged-in user is the owner of the listing
module.exports.listingOwner = async (req,res,next) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if(!listing.owner._id.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
// Middleware to check if the logged-in user is the owner of the review
module.exports.reviewOwner = async (req,res,next) =>{
    const {id , reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review){
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if(!review.username._id.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



// Middleware to handle redirect URL after login
module.exports.redirectUrl = (req,res,next)=>{
    if(req.session.redirectURL ){
       res.locals.redirectURL = req.session.redirectURL ;
       delete req.session.redirectURL; // Clear the stored URL after using it
       console.log("Redirect URL set to:", res.locals.redirectURL);
    }
    next();
}



// Middleware to validate review data
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    }
    next();
}
// Middleware to validate listing data
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    }
    next();
};