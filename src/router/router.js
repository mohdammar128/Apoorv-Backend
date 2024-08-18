const express = require("express");
const {
  checkAuthenticationMiddleware,
  checkUserExistenceMiddleware,
  checkShopAuthorizationMiddleware,
  authorizeAdminMiddleware,
} = require("../middleware/authentication.js");
const {
  signUp,
  getUserDetails,
  deleteUser,
  getUserList,
  shopSignUp,
  getShopList,
  updateShopPassword,
  getUids,
} = require("../controllers/userController.js");
const {
  transferPoints,
  undoTransaction,
  fetchAllTransaction,
} = require("../controllers/transaction.js");

const { getHomeFeed, insertHomeFeed, updateHomeFeed, deleteHomeFeed} = require("../controllers/homeFeed.js");

const router = express.Router();
const {
  transactionMiddleware,
  checkIfRepeatedTransaction,
} = require("../middleware/transactionMiddleware.js");

//admin access 
router.post("/admin-access/feed",authorizeAdminMiddleware, insertHomeFeed);
router.get("/admin-access/feed",authorizeAdminMiddleware, getHomeFeed);
router.delete("/admin-access/feed",authorizeAdminMiddleware, deleteHomeFeed);
router.put("/admin-access/feed/:id",authorizeAdminMiddleware, updateHomeFeed);
router.get("/admin-access/user/:uid",authorizeAdminMiddleware, getUserDetails);
router.get("/admin-access/user-list",authorizeAdminMiddleware, getUserList);
router.delete("/admin-access/user/:uid",authorizeAdminMiddleware, deleteUser);
router.get("/shops", getShopList);
router.put("/shop/password", updateShopPassword);
//EventMap Route

// HomeFeed Routes
router.get("/feed", checkAuthenticationMiddleware, getHomeFeed);
// User route
router.post("/user", checkAuthenticationMiddleware, checkUserExistenceMiddleware, signUp);
router.get("/user/:uid", checkAuthenticationMiddleware, getUserDetails);
router.get("/user-list", checkAuthenticationMiddleware, getUserList);

// Shopkeeper routes
// router.post("/shop", checkAuthenticationMiddleware, checkUserExistenceMiddleware, shopSignUp);
router.post("/shop", checkUserExistenceMiddleware, shopSignUp);
router.get("/shop/:uid", checkAuthenticationMiddleware, checkShopAuthorizationMiddleware, getUserDetails);
//transaction
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


//-------------------------This onlu fecthing for uids manually-------------------------------
router.get("/uids", getUids);
module.exports = router;
