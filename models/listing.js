// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },

//   description: String,

//   image: {
//     filename: {
//       type: String,
//       default: "listingimage"
//     },
//     url: {
//       type: String,
//       default:
//         "https://unsplash.com/photos/a-beach-with-palm-trees-and-a-sunset-2YjUoTdqD1s",
//       set: (v) =>
//         v === ""
//           ? "https://unsplash.com/photos/a-beach-with-palm-trees-and-a-sunset-2YjUoTdqD1s"
//           : v,
//     },
//   },

//   price: Number,
//   location: String,
//   country: String,
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;




const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Review = require("./review");

// Default image (direct image URL, not webpage)
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default: DEFAULT_IMAGE,
      set: (v) => {
        // Handle empty, null, undefined
        if (!v || v.trim() === "") {
          return DEFAULT_IMAGE;
        }
        return v;
      },
    },
  },

  price: {
    type: Number,
  },

  location: {
    type: String,
  },

  country: {
    type: String,
  },
  //added for maps

  geometry: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
    required: true,
  },
  coordinates: {
    type: [Number],
    default: [80.9462, 26.8467],
    required: true,
  },
},

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

// Ensure defaults apply even if image object missing
listingSchema.pre("save", function (next) {
  if (!this.image) {
    this.image = {
      filename: "listingimage",
      url: DEFAULT_IMAGE,
    };
  }

  if (!this.image.url || this.image.url.trim() === "") {
    this.image.url = DEFAULT_IMAGE;
  }

  next();
});



listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;