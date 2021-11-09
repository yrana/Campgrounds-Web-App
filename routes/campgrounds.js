
const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');


const router = express.Router();

router.get('/', async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps });
})


// Create New route 'GET' to display form
// note that this needs to be before :/id route otherwise it takes 'new' route as an id
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

// post 'new' requests. handle new campgrounds submit form
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground data', 400);
    // TODO something is generating an error in POST request from postman tool here 
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect('campgrounds');
}))

// show page
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campSelected = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!campSelected) {
        req.flash('error', 'Cannot find that campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campSelected });
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campSelected = await Campground.findById(id);
    if (!campSelected) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campSelected });
}))

// edit details request
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
    res.redirect(`/campgrounds/${camp._id}`);
}))


// delete campgrounds
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;

    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');

    res.redirect(`/campgrounds`);
}))



module.exports = router;