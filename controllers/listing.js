// const mongoose = require("mongoose");
// const Listing = require("../models/listing");
// const { listingSchema } = require("../schema");
// const { cloudinary } = require("../cloudConfig");
// const axios = require("axios");


// // //  adding for maps step 
// // async function geocode(location, country) {
// //   try {
// //     const query = `${location}, ${country}`;

// //     const url = `https://nominatim.openstreetmap.org/search`;

// //     const response = await axios.get(url, {
// //       params: {
// //         q: query,
// //         format: "json",
// //         limit: 1,
// //       },
// //       headers: {
// //         "User-Agent": "StayAura",
// //       },
// //     });

// //     if (response.data.length > 0) {
// //       return [
// //         parseFloat(response.data[0].lon),
// //         parseFloat(response.data[0].lat),
// //       ];
// //     }

// //     return [80.9462, 26.8467];
// //   } catch (err) {
// //     console.log("Geocoding Error:", err.message);
// //     return [80.9462, 26.8467];
// //   }
// // }

// module.exports.validateListing = (req, res, next) => {
//   const { error } = listingSchema.validate(req.body);

//   if (error) {
//     const errMsg = error.details.map((el) => el.message).join(", ");
//     return res.status(400).send(errMsg);
//   }

//   next();
// };

// module.exports.index = async (req, res) => {
//   const alllistings = await Listing.find({});
//   res.render("listings/index", { alllistings });
// };

// module.exports.renderNew = (req, res) => {
//   res.render("listings/new");
// };

// module.exports.createListing = async (req, res) => {
//   try {
//     const { title, description, price, location, country, imageUrl } = req.body;
//     const image = req.file
//       ? { url: req.file.path, filename: req.file.filename }
//       : { url: imageUrl };

//     const listing = new Listing({
//       title,
//       description,
//       price,
//       location,
//       country,
//       image,
//       owner: req.user._id,
//     });

//     await listing.save();
//     req.flash("success", "Listing created successfully!");
//     res.redirect("/listings");
//   } catch (err) {
//     console.log(err);
//     req.flash("error", "Error creating listing. Please try again.");
//     res.redirect("/listings/new");
//   }
// };

// module.exports.showListing = async (req, res, next) => {
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     req.flash("error", "Invalid listing ID.");
//     return res.redirect("/listings");
//   }
//   try {
//     const listing = await Listing.findById(id)
//       .populate({ path: "reviews", populate: { path: "author" } })
//       .populate("owner");
//     if (!listing) {
//       req.flash("error", "Listing not found.");
//       return res.redirect("/listings");
//     }
//     res.render("listings/show", { listing });
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// };

// module.exports.renderEdit = async (req, res) => {
//   try {
//     const listing = await Listing.findById(req.params.id);
//     if (!listing) {
//       return res.send("Listing not found");
//     }
//     res.render("listings/edit", { listing });
//   } catch (err) {
//     console.log(err);
//     res.send("Error loading edit form");
//   }
// };

// module.exports.updateListing = async (req, res) => {
//   try {
//     const { title, description, price, location, country, imageUrl } = req.body;
//     const listing = await Listing.findById(req.params.id);
//     if (!listing) {
//       req.flash("error", "Listing not found.");
//       return res.redirect("/listings");
//     }

//     listing.title = title;
//     listing.description = description;
//     listing.price = price;
//     listing.location = location;
//     listing.country = country;

//     if (req.file) {
//       if (listing.image && listing.image.filename) {
//         await cloudinary.uploader.destroy(listing.image.filename, {
//           invalidate: true,
//         });
//       }
//       listing.image = {
//         url: req.file.path,
//         filename: req.file.filename,
//       };
//     } else {
//       listing.image = {
//         url: imageUrl || listing.image.url,
//         filename: listing.image.filename,
//       };
//     }

//     await listing.save();

//     req.flash("success", "Listing updated successfully!");
//     res.redirect(`/listings/${req.params.id}`);
//   } catch (err) {
//     console.log(err);
//     req.flash("error", "Error updating listing. Please try again.");
//     res.redirect(`/listings/${req.params.id}/edit`);
//   }
// };

// module.exports.deleteListing = async (req, res) => {
//   try {
//     await Listing.findByIdAndDelete(req.params.id);
//     req.flash("success", "Listing deleted successfully!");
//     res.redirect("/listings");
//   } catch (err) {
//     console.log(err);
//     req.flash("error", "Error deleting listing. Please try again.");
//     res.redirect(`/listings/${req.params.id}`);
//   }
// };


















const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { listingSchema } = require("../schema");
const { cloudinary } = require("../cloudConfig");
const axios = require("axios");

// ==================== GEOCODING ====================

async function geocode(location, country) {
  try {
    const query = `${location}, ${country}`;

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "StayAura",
        },
      }
    );

    if (response.data.length > 0) {
      return [
        parseFloat(response.data[0].lon),
        parseFloat(response.data[0].lat),
      ];
    }

    // Default Lucknow
    return [80.9462, 26.8467];
  } catch (err) {
    console.log("Geocoding Error:", err.message);
    return [80.9462, 26.8467];
  }
}

// ==================== VALIDATION ====================

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    return res.status(400).send(errMsg);
  }

  next();
};

// ==================== INDEX ====================

module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index", { alllistings });
};

// ==================== NEW FORM ====================

module.exports.renderNew = (req, res) => {
  res.render("listings/new");
};

// ==================== CREATE LISTING ====================

module.exports.createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      country,
      imageUrl,
    } = req.body;

    const image = req.file
      ? {
          url: req.file.path,
          filename: req.file.filename,
        }
      : {
          url: imageUrl,
        };

    // Convert address into coordinates
    const coordinates = await geocode(location, country);

    const listing = new Listing({
      title,
      description,
      price,
      location,
      country,
      image,
      owner: req.user._id,
      geometry: {
        type: "Point",
        coordinates,
      },
    });

    await listing.save();

    req.flash("success", "Listing created successfully!");

    res.redirect("/listings");
  } catch (err) {
    console.log(err);

    req.flash("error", "Error creating listing.");

    res.redirect("/listings/new");
  }
};


// ==================== SHOW LISTING ====================

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid listing ID.");
    return res.redirect("/listings");
  }

  try {
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    res.render("listings/show", { listing });

  } catch (err) {
    console.error(err);
    next(err);
  }
};

// ==================== EDIT FORM ====================

module.exports.renderEdit = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.send("Listing not found");
    }

    res.render("listings/edit", { listing });

  } catch (err) {
    console.log(err);
    res.send("Error loading edit form");
  }
};

// ==================== UPDATE LISTING ====================

module.exports.updateListing = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      country,
      imageUrl,
    } = req.body;

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.location = location;
    listing.country = country;

    // Update coordinates automatically
    const coordinates = await geocode(location, country);

    listing.geometry = {
      type: "Point",
      coordinates,
    };

    if (req.file) {
      if (listing.image && listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename, {
          invalidate: true,
        });
      }

      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };

    } else {

      listing.image = {
        url: imageUrl || listing.image.url,
        filename: listing.image.filename,
      };

    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");

    res.redirect(`/listings/${req.params.id}`);

  } catch (err) {
    console.log(err);

    req.flash("error", "Error updating listing.");

    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

// ==================== DELETE LISTING ====================

module.exports.deleteListing = async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);

    req.flash("success", "Listing deleted successfully!");

    res.redirect("/listings");

  } catch (err) {
    console.log(err);

    req.flash("error", "Error deleting listing.");

    res.redirect(`/listings/${req.params.id}`);
  }
};