const mongoose = require("mongoose")

const eventMapSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  map: {
    type: [{
      imageUrl: String,
      subLocation:String
    }],
    required: true
  }

}, {
  timestamps: true
});

const EventMap = mongoose.model(EventMap, eventMapSchema);

module.exports = EventMap;