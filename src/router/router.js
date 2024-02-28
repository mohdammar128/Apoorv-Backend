const express = require("express");
const authMiddleware = require("../middleware/authentication.js");
const { signIn, signUp, getAllDetailsOfUser } = require("../controllers/userController.js")
const { transferPoints } = require("../controllers/transaction.js")
const router = express.Router();
const txnMiddlewarec = require("../middleware/transactionMiddleware.js")

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get('/:uid', getAllDetailsOfUser)
router.put("/transfer-points", txnMiddlewarec, transferPoints);
module.exports = router;
