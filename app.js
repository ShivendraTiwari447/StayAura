
if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user.js");
const User = require("./models/user.js");

const MONGO_URL = process.env.ATLASDB_URL;
console.log("ATLASDB_URL =", process.env.ATLASDB_URL ? "FOUND" : "NOT FOUND");
console.log("SECRET =", process.env.SECRET ? "FOUND" : "NOT FOUND");
console.log("MONGO_URL =", MONGO_URL);

const PORT = process.env.PORT || 8080;

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Connect to MongoDB
main()
  .then(() => console.log("CONNECTED TO DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Express settings
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));



const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  // crypto:{
  //   secret: process.env.SECRET,
  // },
  touchAfter: 24 * 60 * 60 // time period in seconds
});

store.on("error", function(e){
  console.log("SESSION STORE ERROR", e);
});

const sessionOption={
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true
  }
};



  

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/", listingRoutes);



app.use("/", reviewRoutes);
app.use("/", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});