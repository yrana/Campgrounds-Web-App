const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')
const methodOverride = require('method-override') // used for PUT and DELETE requests
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const { campgroundSchema } = require('./schemas.js');


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

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


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
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground data', 400);
    // TODO something is generating an error in POST request from postman tool here 

    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect('campgrounds');
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campSelected = await Campground.findById(id);
    res.render('campgrounds/show', { campSelected });
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campSelected = await Campground.findById(id);
    res.render('campgrounds/edit', { campSelected });
}))

// edit details request
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
    res.redirect(`/campgrounds/${camp._id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404));
})

// error handler - placed at the end so gets routed to the last
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "something went wrong" } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("server has started");
})