const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const router = express.Router();
const userController=require("../controllers/user.js")

router.get("/signup",userController.renderSignupForm );

router.post(
  "/signup",
  wrapAsync(userController.createReview)
);

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.afterLogin
);

router.get("/logout", userController.logout);
module.exports = router;
