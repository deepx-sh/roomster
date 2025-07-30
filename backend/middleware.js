module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //It checks if the current request has an authenticated (logged-in) user.
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be signed in to create a new listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
