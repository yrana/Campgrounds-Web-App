const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
})

//export the schema
module.exports = mongoose.model('Campground', campgroundSchema);