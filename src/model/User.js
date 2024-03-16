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
      enum: ["shop", "user"],
      default: "user",
    },
    fullName: {
      type: String,
      required: true,
    },
    // while signUp we will assign value to cuurentPoints based on the user(if user is client then we will set it zero and if its is shopkeeper then we will set the maximum limit )
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

// Before saving, checks whether the point is negative or not

userSchema.pre("save", function (next) {
  if (this.points < 0) {
    const error = new Error("You have entered invalid points");
    return next(error);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
