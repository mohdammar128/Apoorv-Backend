const mongoose = require("mongoose");
const User = require("../model/User");
const Transaction = require("../model/Transaction");

async function transferPoints(req, res) {
  const { transactionType, from, to, amount ,toName,fromName} = req.body;
  const session = await mongoose.startSession();
  try { 
    session.startTransaction();
    await User.updateOne(
      { uid: from },
      { $inc: { points: -amount } },
      { session, new: true }
    );
    await User.updateOne(
      { uid: to },
      { $inc: { points: amount } },
      { session, new: true }

    ); // Lock and update
    const newTrxn = new Transaction({
      transactionType,
      from: from,
      to: to,
      transactionValue: amount,
      toName,
      fromName
    });

    const response = await newTrxn.save({ session });
    await session.commitTransaction();
    res.status(200).send({
      transactionId: response._id,
      message: `Successfully Transacted amount ${amount}`,
      success: true,
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(402).send({
      error: `Transaction aborted! Please try again.`,
      success: false,
    });
  } finally {
    session.endSession();
  }
}



async function fetchAllTransaction(req, res) {
  const uid = req.params.uid;

  // Input validation (optional but recommended):
  if (!uid) {
    return res.status(400).send({ error: "Authorization Error: Please refresh the page and try again.", success: false });
  }

  const pipeline = [
    {
      // Match transactions for the user (from or to)
      $match: {
        $or: [
          { from: uid },
          { to: uid },
        ],
      },
    },
    {
      // Sort transactions in descending order of createdAt
      $sort: { createdAt: -1 },
    },
  ];

  try {
    const transactions = await Transaction.aggregate(pipeline);

    // Handle empty response gracefully
    if (!transactions.length) {
      return res.status(204).send({ message: "Hey there! Looks like no transactions have happened yet. Why not try sending points to someone or better yet, receive some from a friend? ;)", success: true });
    }

    res.status(200).send({ transactions, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error fetching transactions. Please try again.", success: false });
  }
}




module.exports = { transferPoints, fetchAllTransaction };
