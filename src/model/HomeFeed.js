const mongoose = require("mongoose")

const homeFeedSchema = new mongoose.Schema({
  title: {
    type: String
  },
  text: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  is_active: {
    type: Boolean
  }
})

const HomeFeed = mongoose.model("homefeed", homeFeedSchema);
module.exports = HomeFeed;