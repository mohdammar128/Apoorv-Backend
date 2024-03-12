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

const {
  getHomeFeed,
  insertHomeFeed
} = require("../controllers/homeFeed.js");

const router = express.Router();
const { txnMiddleware, isItSameTransaction } = require("../middleware/transactionMiddleware.js");

// HomeFeed Routes
router.get("/feed", authMiddleware, getHomeFeed);
router.post("/feed", insertHomeFeed);

// User route
router.post("/user", authMiddleware, isUserExistMiddleware, signUp);
router.get("/user/:uid", authMiddleware, getAllDetailsOfUser);
router.delete("/user/:uid",authMiddleware,deleteUser);
router.get("/user-list", authMiddleware, handleQuery);

// Transaction routes
//router.post("/transaction", isItSameTransaction, txnMiddleware, transferPoints);
router.post("/transaction", txnMiddleware, transferPoints);

// router.delete("/transaction/:tid/undo", undoTransaction);
router.get("/transaction/:uid",authMiddleware, fetchAllTransaction);
module.exports = router;
