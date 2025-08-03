const Listing = require("../models/listing.js");
module.exports.index = async (req, res) => {
  let allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
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
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = await new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("successMsg", "Listing created successfully!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl.replace("/upload","/upload/h_50,w_100")
  res.render("listings/edit.ejs", { listing,originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Bad Request");
  // }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("successMsg", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("successMsg", "Listing deleted successfully!");
  res.redirect("/listings");
};
