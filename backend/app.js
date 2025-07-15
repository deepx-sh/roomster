const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
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

app.get("/listings", wrapAsync(async (req, res) => {
  let allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
}));

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
// View Individual Post
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

// Create Listing Route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    // create new instance
    if (!req.body.listing) {
      throw new ExpressError(400, "Bad Request");
    }
    const newListing = await new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Update Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

app.put("/listings/:id", wrapAsync(async (req, res) => {
   if (!req.body.listing) {
      throw new ExpressError(400, "Bad Request");
    }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));
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
  let { statusCode=500, message="Something went wrog!" } = err;
  res.status(statusCode).send(message);
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
