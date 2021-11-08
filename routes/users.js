const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');

// register routes

// register get route - render a register form
router.get('/register', (req, res) => {
    res.render('users/register');
})

// register post route - registers the user
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/campgrounds');
        })

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}))


// login routes

// login get route - renders a login form
router.get('/login', catchAsync(async (req, res) => {
    res.render('users/login');
}))

// login post route
// this uses passport middleware
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/campgrounds'; // this will allow users to redirect to the original page they were trying to reach to. returnTo is stored in middleware
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

//logout route
router.get('/logout', (req, res) => {
    req.logout();  //built it from passport
    req.flash('success', 'Successfully logged out');
    res.redirect('/campgrounds');
})

module.exports = router;