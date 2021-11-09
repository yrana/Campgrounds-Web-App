
const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas.js');
const Review = require('../models/review');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

const router = express.Router({ mergeParams: true });


// route for reviews
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
}))

// route for deleting review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');

    res.redirect(`/campgrounds/${camp._id}`)
}))


module.exports = router;