const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
})

//export the schema
module.exports = mongoose.model('Campground', campgroundSchema);