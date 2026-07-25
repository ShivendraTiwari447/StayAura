const express = require("express");
const router = express.Router();
const { isLoggedIn, isReviewAuthorOrListingOwner } = require("../middleware");
const {
  validateReview,
  createReview,
  deleteReview,
} = require("../controllers/reviews");

router.route("/listings/:id/reviews")
  .post(isLoggedIn, validateReview, createReview);

router.route("/listings/:id/reviews/:reviewId")
  .delete(isReviewAuthorOrListingOwner, deleteReview);

module.exports = router;
