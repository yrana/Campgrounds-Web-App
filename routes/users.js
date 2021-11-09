const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const users = require('../controllers/users');

// register routes

// register get route - render a register form
router.get('/register', users.renderRegister);

// register post route - registers the user
router.post('/register', catchAsync(users.registerUser));


// login routes
// login get route - renders a login form
router.get('/login', catchAsync(users.renderLogin));

// login post route
// this uses passport middleware
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser);


//logout route
router.get('/logout', users.logout);

module.exports = router;