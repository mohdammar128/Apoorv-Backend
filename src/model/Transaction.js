const mongoose = require("mongoose");
const User = require("./User");

const transactionSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: ["shopkeeper", "client"],
      require: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    transactionValue: {
      type: Number,
      require: true
    }
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
