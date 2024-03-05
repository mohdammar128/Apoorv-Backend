const mongoose = require("mongoose")

const homeFeedSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
  }
})

module.exports = mongoose.model("HomeFeed", homeFeedSchema);