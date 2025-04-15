module.exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        req.session.redirectTo = req.originalUrl; // Save original URL
        return res.redirect('/login'); // Redirect to login page
    }
};
