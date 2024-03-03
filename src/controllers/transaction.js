const mongoose = require("mongoose");
const User = require("../model/User");
const Transaction = require("../model/Transaction");

async function transferPoints(req, res) {
  const { transactionType, fromUserId, toUserId, amount } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await User.updateOne(
      { uid: toUserId },
      { $inc: { points: amount } },
      { session, new: true }
    ); // Lock and update

    await User.updateOne(
      { uid: fromUserId },
      { $inc: { points: -amount } },
      { session, new: true }
    );
    const newTrxn = new Transaction({
      transactionType,
      from: fromUserId,
      to: toUserId,
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
      error: `Transaction aborted due to ${error.message}`,
      success: false,
    });
  } finally {
    session.endSession();
  }
}

async function undoTransaction(req, res) {
  const tid = req.params.tid;
  const session = await mongoose.startSession();
  console.log("undo is called");

  try {
    const trxn = await Transaction.findOne({ _id: tid });

    if (!trxn) {
      return res.status(404).send({ error: "Transaction does not exist", success: false });
    }

    console.log(trxn);

    session.startTransaction();
    await User.updateOne(
      { uid: trxn.from },
      { $inc: { points: trxn.transactionValue } },
      { session, new: true }
    );

    await User.updateOne(
      { uid: trxn.to },
      { $inc: { points: -trxn.transactionValue } },
      { session, new: true }
    );

    // Uncomment the line below if you want to delete the transaction after undoing
    await Transaction.deleteOne({ _id: tid }, { session });

    await session.commitTransaction();

    res.status(200).send({
      transactionId: trxn._id, // Use trxn._id instead of response._id
      message: `Successfully undone amount ${trxn.transactionValue}`, // Use trxn.transactionValue instead of amount
      success: true,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(502).send({
      error: `Undo aborted due to ${error.message}, please try again`,
      success: false,
    });
  } finally {
    session.endSession();
  }
}


module.exports = { transferPoints, undoTransaction };
