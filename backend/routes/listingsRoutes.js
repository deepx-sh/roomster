const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {
  isLoggedIn,
  isOwner,
  validatelistingSchema,
} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// Index Route

router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn,listingController.renderNewForm );
// View Individual Post
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);

// Create Listing Route
router.post(
  "/",
  isLoggedIn,
  validatelistingSchema,
  wrapAsync(listingController.createListing)
);

// Update Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validatelistingSchema,
  wrapAsync(listingController.updateListing)
);

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
