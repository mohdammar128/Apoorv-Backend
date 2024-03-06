const express = require("express");
const {
  authMiddleware,
  isUserExistMiddleware,
} = require("../middleware/authentication.js");
const {
  signUp,
  getAllDetailsOfUser,
  deleteUser,
  handleQuery,
} = require("../controllers/userController.js");
const {
  transferPoints,
  undoTransaction,
  fetchAllTransaction,
} = require("../controllers/transaction.js");
const router = express.Router();
const { txnMiddleware, isItSameTransaction } = require("../middleware/transactionMiddleware.js");

/* User related routes  */
// authMiddleware, isUserExistMiddleware
router.post("/user", authMiddleware, isUserExistMiddleware, signUp);
router.get("/user/:uid", getAllDetailsOfUser);
router.delete("/user/:uid", deleteUser);
router.get("/user-list", handleQuery);

/* transaction related routes */
router.post("/transaction", isItSameTransaction, txnMiddleware, transferPoints);
// router.delete("/transaction/:tid/undo", undoTransaction);
router.get("/transaction/:uid", fetchAllTransaction);
module.exports = router;
