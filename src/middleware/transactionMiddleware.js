const User = require("../model/User")
const Transaction = require("../model/Transaction")

async function isItSameTransaction(req, res, next) {
  // console.log("isSameTrxn is called")
  const { fromUserId, toUserId, amount, transactionType } = req.body;
  const force = req.query.force;
  // console.log(typeof (force))
  try {
    if (force !== null && force === "true") {
      console.log("move to next funtion")
      return next();
    }
    const response = await Transaction.findOne({ transactionType, from: fromUserId, to: toUserId, transactionValue: amount, }).sort({ createdAt: -1 });
    console.log(response)
    if (!response) {
      return next();
    }

    res.status(432).send({ cautious: "Do you want to repeat Transaction", sucess: true })

  } catch (error) {
    res.status(502).send({ error: "something went wrong", success: false });
  }

}

async function txnMiddleware(req, res, next) {
  console.log(" txnMiddleware is called")
  try {
    const { fromUserId, toUserId, amount } = req.body;
    const fromUser = await User.findOne({ uid: fromUserId });
    if (fromUser.points < amount) {
      return res.status(502).send({ error: "You have not Sufficient Points", success: false });
    }
    const toUser = await User.findOne({ uid: toUserId });
    if (!toUser) {
      return res.status(400).send({ error: "User not found", success: false });
    }

    next();
  } catch (error) {
    res.status(404).send({ error: "something went wrong", success: false })
  }
}

module.exports = { txnMiddleware, isItSameTransaction };