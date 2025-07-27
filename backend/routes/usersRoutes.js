const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = await new User({ email, username });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.flash("successMsg", "Welcome to Roomsters!");
      res.redirect("/listings");
    } catch (error) {
      req.flash("errorMsg", error.message);
      res.redirect("/signup");
    }
  })
);
module.exports = router;
