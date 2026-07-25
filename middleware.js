const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {

    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }

  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  if (!listing.owner || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to modify this listing.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.isReviewAuthorOrListingOwner = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }

  const { id, reviewId } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found.");
    return res.redirect(`/listings/${id}`);
  }

  const userId = req.user._id.toString();
  const isAuthor = review.author && review.author.toString() === userId;
  const isListingOwner = listing.owner && listing.owner.toString() === userId;

  if (!isAuthor && !isListingOwner) {
    req.flash("error", "You do not have permission to delete this review.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  res.locals.redirectUrl = req.session.redirectUrl || "/listings";
  next();
};