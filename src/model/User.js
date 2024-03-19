const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
    },
    role: {
      type: String,
      enum: ["shop", "user","admin"],
      default: "user",
    },
    fullName: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 50,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    fromCollege: {
      type: Boolean,
    },
    collegeName: {
      type: String,
    },
    phone: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    password: {
      type: String,
    },
    pointsArray: {
      type: [Number],
    },
  },
  {
    timestamps: true,
  }
);

// Pre save hook to check if the points are valid
userSchema.pre("save", function (next) {
  if (this.points < 0) {
    const error = new Error("You have entered invalid points");
    return next(error);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
