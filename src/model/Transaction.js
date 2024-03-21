const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: ["shop", "user"],
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    toName: {
      type: String,
      required: true
    },
    fromName: {
      type: String,
      required: true
    },
    transactionValue: {
      type: Number,
      required: true,
    },
    cardId: {
    type:Number
    }
  },

  {
    timestamps: true,

  }
);


const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

