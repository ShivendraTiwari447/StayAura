const mongoose = require("mongoose");
const { data: sampleListings } = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("CONNECTED TO DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    const listingsWithOwner = sampleListings.map((obj) => ({
      ...obj,
      owner: "691c0c367674d29cbcf753b8",
    }));
    await Listing.insertMany(listingsWithOwner);
    console.log("data initialized");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
};

initDB();
