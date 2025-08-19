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
});
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;