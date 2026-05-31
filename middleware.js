

//  global Middleware


  function logging(req, res, next){
    if (!req.isAuthenticated()) {
      return res.redirect("/login"); // ✅ stop here
    }
    next(); // only runs if logged in
  }

  module.exports = logging;