const mongoose = require("mongoose")

const homeFeedSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Welcome to Apoorv Mr Ammar"
  },
  feed: {
    type: String,
    default: "Abra Ka dabra"
  },
  imageUrl: {
    type: String,
    default: "Image not found"
  }
})

module.exports = mongoose.model("HomeFeed", homeFeedSchema);