const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const listingSchema = require("./schema.js");
// const reviewSchema = require("./schema.js");
const { listingSchema, reviewSchema } = require('./schema.js')
const Review = require("./models/review.js");
const listingsRoutes=require('./routes/listingsRoutes.js')
const port = 3001;

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/roomster");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "public")));

// Listing routes
app.use("/listings",listingsRoutes)
app.get("/", (req, res) => {
  res.send("Home Page");
});



let validatereviewSchema = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};


// Review
// Post Route for review add for specific listing
app.post(
  "/listings/:id/reviews",
  validatereviewSchema,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete Route for Review Delete
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);
// app.get("/testListing", async (req, res) => {
//   let sampleTest = new Listing({
//     title: "Deep Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Mehsana, Gujarat",
//     country: "India",
//   });
//   await sampleTest.save();
//   console.log("Sample was saved");
//   res.send("Successfully Saved");
// });

// The app.all() function is used to route all types of HTTP requests
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});
// Custom Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrog!" } = err;
  res.status(statusCode).render("Error.ejs", { err });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
