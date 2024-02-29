const express = require("express");
const authMiddleware = require("../middleware/authentication.js");
const { signUp, getAllDetailsOfUser } = require("../controllers/userController.js")
const { transferPoints } = require("../controllers/transaction.js")
const router = express.Router();
const txnMiddlewarec = require("../middleware/transactionMiddleware.js")


// signUp 
router.post("/user", authMiddleware, signUp);
// get user details if its exist otherswise redirect them to signUp page based on backend status send to frontend 
router.get('/:uid', getAllDetailsOfUser)
// 
router.put("/transfer-points", txnMiddlewarec, transferPoints);
module.exports = router;
