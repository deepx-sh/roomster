const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    // This default properties is for when image option not give to user and this default image will be used
    default:
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    // This set function of mongoose schema validatiors for geter and seter properties used to when we give option to image link to user and user forget to add image link then this image link will be used
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Listing Model

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
