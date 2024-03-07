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

module.exports = mongoose.model("homefeed", homeFeedSchema);