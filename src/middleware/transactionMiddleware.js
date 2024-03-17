const User = require("../model/User")
const Transaction = require("../model/Transaction")

async function checkIfRepeatedTransaction(req, res, next) {
  const { from, to, amount, transactionType } = req.body;
  const force = req.query.force;
  try {
    if (force !== null && force === "true") {
      return next();
    }
    const response = await Transaction.findOne({ transactionType, from: from, to: to }).sort({ createdAt: -1 });
    // console.log(response.transactionValue,amount)
    if (response.transactionValue !== amount) {
      return next();
    }
  

    res.status(432).send({ cautious: "It appears that your current transaction matches the one you recently completed. Would you like to proceed with the same transaction again?", sucess: true })

  } catch (error) {
    res.status(500).send({ error: "Error checking for duplicate transaction, please try again!", success: false });
  }

}

async function transactionMiddleware(req, res, next) {
  try {
    const { from, to, amount } = req.body;
    const fromUser = await User.findOne({ uid: from });

    if (fromUser.points < amount) {
      return res.status(502).send({ error: "Oops! It seems like you don't have sufficient points for this transaction. Why not try participating in more games to earn additional points?", success: false });
    }
    const toUser = await User.findOne({ uid: to });
    if (!toUser) {
      return res.status(404).send({ error: "User details not found. Please refresh the page and try again.", success: false });
    }
    req.body["toName"] = toUser.fullName;
   req.body["fromName"]=fromUser.fullName;

    next();
  } catch (error) {
    res.status(500).send({ error: "Error during the transaction. Please try again later.", success: false })
  }
}

module.exports = { transactionMiddleware, checkIfRepeatedTransaction };
