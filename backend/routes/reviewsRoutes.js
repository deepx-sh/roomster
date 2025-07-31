const express = require("express");
// When you use express.Router() with { mergeParams: true }, it allows the router to access route parameters defined in its parent route.
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewController=require("../controllers/review.js")
const {
  validatereviewSchema,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

// Review
// Post Route for review add for specific listing
router.post(
  "/",
  isLoggedIn,
  validatereviewSchema,
  wrapAsync(reviewController.createReview)
);

// Delete Route for Review Delete
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
