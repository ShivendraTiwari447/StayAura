const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome to Wanderlust! You are now logged in.");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  if (req.session.redirectUrl) delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out!");
    res.redirect("/listings");
  });
};

module.exports.demo = async (req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "student",
  });

  const registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
};