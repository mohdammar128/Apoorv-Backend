const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    rollNumber: {
      type: String
    },
    role: {
      type: String,
      enum: ["shopKeeper", "client"],
      default: "user",
    },
    fullName: {
      type: String,
      require: true,
    },
    // while signUp we will assign value to cuurentPoints based on the user(if user is client then we will set it zero and if its is shopkeeper then we will set the maximum limit )
    points: {
      type: Number,
      default: 0,

    },
    // A user can have multiple transactions that's why we are storing transactions as array elements
    transactionDetails: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Transaction",
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

// Before saving, checks whether the point is negative or not

userSchema.pre('save', function (next) {
  if (this.points < 0) {
    const error = new Error("You have entered invalid points");
    return next(error);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
