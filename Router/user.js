const express=require("express");
const route=express.Router();
const logging=require("../middleware")
const User = require("../model/user");
const passport = require("passport");

/* ===================== signup logic ===================== */

route.get("/signup", (req, res) => {
 
    res.render("Account/signup"); // ✅ fix
  });
  
  route.post("/signup", async (req, res, next) => {
    try {
      const { username, password, email } = req.body;
  
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
  
      req.login(registeredUser, (err) => {
        if (err) return next(err);
  
        req.flash("success", "Signup successful! ");
        res.redirect("/profile");
      });
  
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  });
  
  /* ===================== Login logic ===================== */
  route.get("/login",(req,res)=>{
    res.render("Account/login");
  })
  
  route.post("/login",
    (req,res,next)=>{
      console.log(req.body); // should show email + password
      next();
    },
    passport.authenticate("local", {
      failureRedirect: "/login",
    }),
    (req,res)=>{
      // console.log(req.user);
      req.flash("success", "login Successfully !");
      res.redirect("/profile");
      
  
  }
  );
  
  /* ===================== Logout logic ===================== */
  
  route.get("/logout", logging,(req, res, next) => {
    req.logout(function(err) {
      if (err) return next(err);
      req.flash("success", "logout successfully 🎉");
      res.redirect("/profile");
    })
  })
  
  module.exports=route;
  
  
   
