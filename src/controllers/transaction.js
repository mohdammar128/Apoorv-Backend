const mongoose = require("mongoose");
const User = require("../model/User");
const Transaction = require("../model/Transaction");

async function transferPoints(req, res) {
  const { transactionType, from, to, amount } = req.body;
  const session = await mongoose.startSession();


  try {
    
    await User.updateOne(
      { uid: to },
      { $inc: { points: amount } },
      { session, new: true }
    ); // Lock and update

    await User.updateOne(
      { uid: from },
      { $inc: { points: -amount } },
      { session, new: true }
    );
    const newTrxn = new Transaction({
      transactionType,
      from: from,
      to: to,
      transactionValue: amount,
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
    res.status(502).send({
      error: `Transaction aborted due to ${error}`,
      success: false,
    });
  } finally {
    session.endSession();
  }
}

// async function undoTransaction(req, res) {
//   const tid = req.params.tid;
//   const session = await mongoose.startSession();
//   console.log("undo is called");

//   try {
//     const trxn = await Transaction.findOne({ _id: tid });

//     if (!trxn) {
//       return res.status(404).send({ error: "Transaction does not exist", success: false });
//     }

//     console.log(trxn);

//     session.startTransaction();
//     await User.updateOne(
//       { uid: trxn.from },
//       { $inc: { points: trxn.transactionValue } },
//       { session, new: true }
//     );

//     await User.updateOne(
//       { uid: trxn.to },
//       { $inc: { points: -trxn.transactionValue } },
//       { session, new: true }
//     );


//     await Transaction.deleteOne({ _id: tid }, { session });

//     await session.commitTransaction();

//     res.status(200).send({
//       transactionId: trxn._id, // Use trxn._id instead of response._id
//       message: `Successfully undone amount ${trxn.transactionValue}`, // Use trxn.transactionValue instead of amount
//       success: true,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(502).send({
//       error: `Undo aborted due to ${error.message}, please try again`,
//       success: false,
//     });
//   } finally {
//     session.endSession();
//   }
// }

async function fetchAllTransaction(req, res) {
  const uid = req.params.uid;

  // Input validation (optional but recommended):
  if (!uid) {
    return res.status(400).send({ error: "Bad request: Missing user ID", success: false });
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
      return res.status(204).send({ message: "No transactions found for this user", success: true });
    }

    res.status(200).send({ transactions, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error", success: false });
  }
}



module.exports = { transferPoints, fetchAllTransaction };
