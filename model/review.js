const mongoose = require('mongoose');
const schema = mongoose.Schema;

const reviewSchema = new schema({
    username:{
           type: schema.Types.ObjectId,
           ref: 'User'
    } ,
    content: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    Date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Review',reviewSchema);
