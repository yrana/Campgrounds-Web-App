
const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas.js');
const Review = require('../models/review');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/review');

const router = express.Router({ mergeParams: true });


// route for reviews
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// route for deleting review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;