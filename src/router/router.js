const express = require("express");
const {
  checkAuthenticationMiddleware,
  checkUserExistenceMiddleware,
  checkShopAuthorizationMiddleware,
} = require("../middleware/authentication.js");
const {
  signUp,
  getUserDetails,
  deleteUser,
  getUserList,
  shopSignUp,
  getShopList,
  updateShopPassword,
} = require("../controllers/userController.js");
const {
  transferPoints,
  undoTransaction,
  fetchAllTransaction,
} = require("../controllers/transaction.js");

const { getHomeFeed, insertHomeFeed } = require("../controllers/homeFeed.js");

const router = express.Router();
const {
  transactionMiddleware,
  checkIfRepeatedTransaction,
} = require("../middleware/transactionMiddleware.js");

// HomeFeed Routes
router.get("/feed", checkAuthenticationMiddleware, getHomeFeed);
router.post("/feed", insertHomeFeed);

// User route
router.post("/user", checkAuthenticationMiddleware, checkUserExistenceMiddleware, signUp);
router.get("/user/:uid", checkAuthenticationMiddleware, getUserDetails);
router.delete("/user/:uid", checkAuthenticationMiddleware, deleteUser);
router.get("/user-list", checkAuthenticationMiddleware, getUserList);

// Shopkeeper routes
// router.post("/shop", checkAuthenticationMiddleware, checkUserExistenceMiddleware, shopSignUp);
router.post("/shop", checkUserExistenceMiddleware, shopSignUp);
router.get("/shops", getShopList);
router.put("/shop/password", updateShopPassword);
router.get("/shop/:uid", checkAuthenticationMiddleware, checkShopAuthorizationMiddleware, getUserDetails);
router.post(
  "/shop/transaction",
  checkShopAuthorizationMiddleware,
  transactionMiddleware,
  transferPoints
);

// Transaction routes
//router.post("/transaction", checkIfRepeatedTransaction, transactionMiddleware, transferPoints);
router.post("/transaction", transactionMiddleware, transferPoints);

// router.delete("/transaction/:tid/undo", undoTransaction);
router.get("/transaction/:uid", checkAuthenticationMiddleware, fetchAllTransaction);
module.exports = router;
