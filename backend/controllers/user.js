const User=require("../models/user.js")
module.exports.renderSignupForm=(req, res) => {
  res.render("users/signup.ejs");
};

module.exports.createReview=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = await new User({ email, username });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("successMsg", "Welcome to Roomsters!");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
}
  
module.exports.renderLoginForm=(req, res) => {
  res.render("users/login.ejs");
};

module.exports.afterLogin=async (req, res) => {
    req.flash("successMsg", "Welcome back to Roomsters!");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}
  
module.exports.logout=(req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("successMsg", "You have been logged out successfully!");
    res.redirect("/listings");
  });
}