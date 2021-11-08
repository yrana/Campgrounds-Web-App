
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { // this method comes from passport package
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

