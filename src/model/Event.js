const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true, // Corrected typo: 'required' instead of 'require'
    },
    eventDescription: {
      type: String,
      required: true, // Corrected typo: 'required' instead of 'require'
    },
    startTime: {
      type: Date,
      required: true, // Corrected typo: 'required' instead of 'require'
    },
    endTime: {
      type: Date,
      required: true, // Corrected typo: 'required' instead of 'require'
    },
    imageUrl: {
      type: String,
      default: "abcd",
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.pre('save', async function (next) {
  if (this.startTime >= this.endTime) {
    return next(new Error("Start time of the event should be less than the end time."));
  }

  next();
});

module.exports = mongoose.model("Event", eventSchema);
