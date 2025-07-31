const express = require('express');
// When you use express.Router() with { mergeParams: true }, it allows the router to access route parameters defined in its parent route.
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validatereviewSchema, isLoggedIn}=require("../middleware.js")

// Review
// Post Route for review add for specific listing
router.post(
  "/",isLoggedIn,
  validatereviewSchema,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    newReview.author = req.user._id;
    await newReview.save();
    await listing.save();
    req.flash("successMsg", "Review added successfully!");
    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete Route for Review Delete
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("successMsg", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;