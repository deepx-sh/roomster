const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");
const reviewSchema = require("./schema.js");
const Review = require("./models/review.js");
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

app.get("/", (req, res) => {
  res.send("Home Page");
});

// Index Route

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  })
);

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
// View Individual Post
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

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

let validatereviewSchema = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};
// Create Listing Route
app.post(
  "/listings",
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
    res.redirect("/listings");
  })
);

// Update Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

app.put(
  "/listings/:id",
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

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

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
