if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingsRoutes = require("./routes/listingsRoutes.js");
const reviewsRoutes = require("./routes/reviewsRoutes.js");
const userRoutes=require('./routes/usersRoutes.js')
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require('passport');
const LocalStategy = require('passport-local');
const User=require('./models/user.js')
const port = 3001;

const dbURL = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  store: MongoStore.create({
    crypto: {
      secret: process.env.SECRET_SESSION_CRYPTO
    },
    mongoUrl: process.env.ATLASDB_URL,
    touchAfter: 24 * 3600,
    ttl:14 * 24 * 60 * 60 // = 14 days (time to live)
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:"lax",
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); //Start Passport middleware
app.use(passport.session()); //Connect Passport to session system

passport.use(new LocalStategy(User.authenticate())); //	Define login strategy
passport.serializeUser(User.serializeUser()); //Handle user session storing
passport.deserializeUser(User.deserializeUser()); //Handle user session retrieving

app.use((req, res, next) => {
  res.locals.success = req.flash("successMsg");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
// Listing routes
app.use("/listings", listingsRoutes);

// Reviews Route
app.use("/listings/:id/reviews", reviewsRoutes);

// Users Route
app.use("/",userRoutes)
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
