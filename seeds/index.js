const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const c = new Campground({
            author: '6188ac186049ef20d91e5d65',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/duxjb5w5t/image/upload/v1636438487/YelpCamp/zkbg52ibucbeq3k5zwxw.jpg',
                    filename: 'YelpCamp/zkbg52ibucbeq3k5zwxw'
                }
            ],
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem perspiciatis quam dignissimos odio alias, aperiam voluptatibus consequuntur libero recusandae ipsa officiis ratione. Earum ut veniam culpa. Voluptatibus nam aliquam distinction',
            price: price
        })
        await c.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})