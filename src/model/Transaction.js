const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: ["shop", "user"],
      required: true, // Corrected typo: 'required' instead of 'require'
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    transactionValue: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,

  }
);


const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

