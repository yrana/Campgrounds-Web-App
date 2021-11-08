const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [  // "one to many" relationship
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// 'findOneAndDelete' comes from the mongoose docs. because we're using findByIdAndDelete() in the app.js for deleting campgrounds,
// mongoose docs say that it will run findOneAndDelete middleware after that.
// also note that its a query middleware - works differently (passes in doc instead of allowing us to use 'this' keyword)
CampgroundSchema.post('findOneAndDelete', async function (doc) {

    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

//export the schema
module.exports = mongoose.model('Campground', CampgroundSchema);