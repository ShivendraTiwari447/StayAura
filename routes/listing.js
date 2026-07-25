const express = require("express");
const router = express.Router();
const {
  index,
  renderNew,
  createListing,
  showListing,
  renderEdit,
  updateListing,
  deleteListing,
  validateListing,
} = require("../controllers/listing");
const { isLoggedIn, isOwner } = require("../middleware");

router.route("/")
  .get(index);

router.route("/listings")
  .get(index)
  .post(isLoggedIn, validateListing, createListing);

router.route("/listings/new")
  .get(isLoggedIn, renderNew);

router.route("/listings/:id")
  .get(showListing)
  .put(isLoggedIn, isOwner, validateListing, updateListing)
  .delete(isLoggedIn, isOwner, deleteListing);

router.route("/listings/:id/edit")
  .get(isLoggedIn, isOwner, renderEdit);

module.exports = router;
