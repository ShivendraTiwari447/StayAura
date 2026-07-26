const express = require("express");
const router = express.Router();

const multer = require("multer");
const {storage}=require("../cloudConfig.js")

const upload = multer({ storage });




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

  // ============================
  // ADD upload.single() HERE
  // ============================
  // Old:
  // .post(isLoggedIn, validateListing, createListing)

  // New:
  .post(
    upload.single("image"), // <-- Image upload middleware
    isLoggedIn,
    validateListing,
    createListing
  );

  // ============================
  // ONLY FOR TESTING (DON'T USE WITH ABOVE)
  // Uncomment this if you only want to see req.file
  // ============================
  /*
  .post(
    upload.single("image"),
    (req, res) => {
      res.send(req.file);
    }
  );
  */

router.route("/listings/new")
  .get(isLoggedIn, renderNew);

router.route("/listings/:id")
  .get(showListing)
  .put(isLoggedIn, isOwner, upload.single("image"), validateListing, updateListing)
  .delete(isLoggedIn, isOwner, deleteListing);

router.route("/listings/:id/edit")
  .get(isLoggedIn, isOwner, renderEdit);

module.exports = router;