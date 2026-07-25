const mongoose = require('mongoose');
const Listing = require('./models/listing');
(async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    const count = await Listing.countDocuments();
    const listings = await Listing.find({}).limit(5);
    console.log('count', count);
    console.log(listings.map(l => ({ id: l._id.toString(), title: l.title })));
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
