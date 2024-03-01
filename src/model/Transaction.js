const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: ["shopkeeper", "client"],
      required: true, // Corrected typo: 'required' instead of 'require'
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Corrected typo: 'required' instead of 'require'
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Corrected typo: 'required' instead of 'require'
    },
    transactionValue: {
      type: Number,
      required: true, // Corrected typo: 'required' instead of 'require'
    }
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

