
const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

const router = express.Router();

router.get('/', catchAsync(campgrounds.index));

// Create New route 'GET' to display form
// note that this needs to be before :/id route otherwise it takes 'new' route as an id
router.get('/new', campgrounds.renderNewForm);

// post 'new' requests. handle new campgrounds submit form
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// show page
router.get('/:id', catchAsync(campgrounds.showCampground));

// render edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// edit details request
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// delete campgrounds
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


module.exports = router;