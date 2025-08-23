const mongoose = require("mongoose");
const Review = require("./review");
const schema = mongoose.Schema;

const listingSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        default: "https://expertvagabond.com/wp-content/uploads/cheap-travel-accommodation-guide.jpg",
        set: (v) => v === "" ? "https://expertvagabond.com/wp-content/uploads/cheap-travel-accommodation-guide.jpg" : v,
    },
    reviews: [{
        type: schema.Types.ObjectId,
        ref: "Review"
    }],
    owner:{
        type: schema.Types.ObjectId,
        ref: "User",
    }
});
// schema have pre and post middlewares like express
// here we are using post middleware to delete all reviews associated with a listing when the listing is deleted
// post middleware is executed after the operation is completed
// here we are using findOneAndDelete because findByIdAndDelete internally uses findOneAndDelete
// pre middleware is executed before the operation is completed
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;