const mongoose = require("mongoose")

const homeFeedSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
    },
    image_url: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,

  })

const HomeFeed = mongoose.model("homefeed", homeFeedSchema);
module.exports = HomeFeed;