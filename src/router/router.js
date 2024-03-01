const express = require("express");
const { authMiddleware, isUserExistMiddleware } = require("../middleware/authentication.js");
const { signUp, getAllDetailsOfUser, deleteUser, handleQuery } = require("../controllers/userController.js")
const { transferPoints } = require("../controllers/transaction.js")
const router = express.Router();
const txnMiddlewarec = require("../middleware/transactionMiddleware.js")

/* User related routes  */
// authMiddleware, isUserExistMiddleware 
router.post("/user", signUp);
router.get('/user/:uid', getAllDetailsOfUser)
router.get('/user/:uid', deleteUser)
router.get('/user-list', handleQuery)

/* transaction related routes */
router.put("/transfer-points", txnMiddlewarec, transferPoints);
module.exports = router;
