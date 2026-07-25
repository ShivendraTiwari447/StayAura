const Listing = require("../models/listing");
const Review = require("../models/review");
const { reviewSchema } = require("../schema");

module.exports.validateReview = async (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    const listing = await Listing.findById(req.params.id).populate("reviews");
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    req.flash("error", errMsg);
    return res.redirect(`/listings/${req.params.id}`);
  }

  next();
};

module.exports.createReview = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.send("Listing not found");
    }

    const newReview = new Review({
      ...req.body.review,
      author: req.user._id,
    });
    await newReview.save();

    listing.reviews.push(newReview);
    await listing.save();

    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.log(err);
    req.flash("error", "Error adding review. Please try again.");
    res.redirect(`/listings/${req.params.id}`);
  }
};

module.exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log(err);
    req.flash("error", "Error deleting review. Please try again.");
    res.redirect(`/listings/${req.params.id}`);
  }
};