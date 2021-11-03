const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')
const methodOverride = require('method-override') // used for PUT and DELETE requests
const ejsMate = require('ejs-mate');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'))


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps });
})


// Create New route 'GET' to display form
// note that this needs to be before :/id route otherwise it takes 'new' route as an id
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

// post 'new' requests. handle new campgrounds submit form
app.post('/campgrounds', async (req, res) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect('campgrounds');
})

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campSelected = await Campground.findById(id);
    res.render('campgrounds/show', { campSelected });
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campSelected = await Campground.findById(id);
    res.render('campgrounds/edit', { campSelected });
})

// edit details request
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
    res.redirect(`/campgrounds/${camp._id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
})


app.listen(3000, () => {
    console.log("server has started");
})