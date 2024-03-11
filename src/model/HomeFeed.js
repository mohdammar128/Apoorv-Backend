const mongoose = require("mongoose")

const homeFeedSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,

  })

const HomeFeed = mongoose.model("homefeed", homeFeedSchema);
module.exports = HomeFeed;