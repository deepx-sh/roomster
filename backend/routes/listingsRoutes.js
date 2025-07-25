const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { listingSchema} = require('../schema.js')


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
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});
// View Individual Post
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

// Create Listing Route
router.post(
  "/",
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
    await newListing.save();
    req.flash("successMsg", "Listing created successfully!");
    res.redirect("/listings");
  })
);

// Update Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  validatelistingSchema,
  wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Bad Request");
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);



module.exports = router;