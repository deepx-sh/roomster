const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { listingSchema } = require('../schema.js')
const {isLoggedIn,isOwner}=require("../middleware.js")


// This middleware bind the logic of the joi tool
let validatelistingSchema = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};
// Index Route

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  })
);

// New Route
router.get("/new",isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});
// View Individual Post
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    console.log(listing);
    
    res.render("listings/show.ejs", { listing });
  })
);

// Create Listing Route
router.post(
  "/",isLoggedIn,
  validatelistingSchema,
  wrapAsync(async (req, res, next) => {
    // create new instance
    // Here this if condition is only check if listing object is present or not if not then it will give error
    // But Here it will not check inside listing object individual field validation
    // For Individual field Validation we used two ways one we write if conditon for all field but this make code bulky
    // So we use second way in this we used joi tool which is used for server side schema validation
    // Which validate individual field
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Bad Request");
    // }
    // // Like this we check validate for individul field but this make code bulky so we used joi
    // if (!req.body.listing.title) {
    //   throw new ExpressError(400,"Title is required")
    // }
    // let result = listingSchema.validate(req.body);
    // if (result.error) {
    //   throw new ExpressError(400, result.error);
    // }
    // Above code is comment out because we create another middleware to bind joi tool logic
    const newListing = await new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("successMsg", "Listing created successfully!");
    res.redirect("/listings");
  })
);

// Update Route
router.get(
  "/:id/edit",isLoggedIn,isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",isLoggedIn,isOwner,
  validatelistingSchema,
  wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Bad Request");
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("successMsg", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",isLoggedIn,isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("successMsg", "Listing deleted successfully!");
    res.redirect("/listings");
  })
);



module.exports = router;