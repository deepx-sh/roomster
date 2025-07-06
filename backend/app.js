const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
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

app.get("/listings", async (req, res) => {
  let allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
});

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
// View Individual Post
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// Create Listing Route
app.post("/listings", async (req, res) => {
  // create new insta
  const newListing = await new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// Update Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings")
})
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


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
