const express = require("express");
const {
  authMiddleware,
  isUserExistMiddleware,
  isShopAuthorized,
} = require("../middleware/authentication.js");
const {
  signUp,
  getAllDetailsOfUser,
  deleteUser,
  handleQuery,
  shopSignUp,
  getAllShops,
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
  txnMiddleware,
  isItSameTransaction,
} = require("../middleware/transactionMiddleware.js");

// HomeFeed Routes
router.get("/feed", authMiddleware, getHomeFeed);
router.post("/feed", insertHomeFeed);

// User route
router.post("/user", authMiddleware, isUserExistMiddleware, signUp);
router.get("/user/:uid", authMiddleware, getAllDetailsOfUser);
router.delete("/user/:uid", authMiddleware, deleteUser);
router.get("/user-list", authMiddleware, handleQuery);

// Shopkeeper routes
// router.post("/shop", authMiddleware, isUserExistMiddleware, shopSignUp);
router.post("/shop", isUserExistMiddleware, shopSignUp);
router.get("/shops", getAllShops);
router.put("/shop/password", updateShopPassword);
router.get("/shop/:uid", authMiddleware, isShopAuthorized, getAllDetailsOfUser);
router.post(
  "/shop/transaction",
  isShopAuthorized,
  txnMiddleware,
  transferPoints
);

// Transaction routes
//router.post("/transaction", isItSameTransaction, txnMiddleware, transferPoints);
router.post("/transaction", txnMiddleware, transferPoints);

// router.delete("/transaction/:tid/undo", undoTransaction);
router.get("/transaction/:uid", authMiddleware, fetchAllTransaction);
module.exports = router;
