const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingsRoutes = require('./routes/listingsRoutes.js')
const reviewsRoutes=require('./routes/reviewsRoutes.js')
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
app.use("/listings", listingsRoutes)

// Reviews Route
app.use("/listings/:id/reviews", reviewsRoutes);
app.get("/", (req, res) => {
  res.send("Home Page");
});

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
