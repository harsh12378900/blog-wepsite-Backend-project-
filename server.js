if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = require("./src/app");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require('cookie-parser')
const methodOverride = require("method-override");
const session = require('express-session')
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user");
const MongoStore = require("connect-mongo").default;;


const flash = require("connect-flash");
const postRoute=require("./Router/Post.js");
const userRoute=require("./Router/user.js");
/* ===================== BASIC SETUP ===================== */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // ⭐ important
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());
/* ===================== DATABASE ===================== */
const dbUrl = process.env.MONGO_URL;
mongoose.connect(dbUrl)
.then(() => {
  console.log("MongoDB connection successful");

})
.catch((err) => console.log(err));
  /* ===================== SESSION ===================== */
app.use(session({
  secret: process.env.MY_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL
  }),
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
}))
app.use(flash());
/* ===================== PASSPORT ===================== */

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy( User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

    /* ===================== LOCALS (FLASH) ===================== */
    app.use((req, res, next) => {

      const success = req.flash("success");
      const error = req.flash("error");
    // console.log("User" + req.user)
      console.log("SUCCESS:", success);
      res.locals.currentUser = req.user;
      res.locals.success = success;
      res.locals.error = error;
      next();
    });

/* ===================== ROUTES ===================== */

app.use("/",postRoute);
app.use("/",userRoute);

app.get("/", (req, res) => {
  res.redirect("/profile");
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});