const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    eventDescription: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    imageUrl: {
      type: String,

    },
  },
  {
    timestamps: true,
  }
);

// Pre save hook to check if the start time is less than the end time
eventSchema.pre('save', async function (next) {
  if (this.startTime >= this.endTime) {
    return next(new Error("Start time of the event should be less than the end time."));
  }
  next();
});

module.exports = mongoose.model("Event", eventSchema);
