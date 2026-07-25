const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.route("/signup")
  .get(users.renderSignup)
  .post(wrapAsync(users.registerUser));

router.route("/login")
  .get(users.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    users.loginUser
  );

router.route("/logout")
  .get(users.logoutUser);

router.route("/demo")
  .get(users.demo);

module.exports = router;