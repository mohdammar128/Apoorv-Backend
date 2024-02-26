const express = require("express");
const authMiddleware = require("../middleware/authentication.js");
const { signIn, signUp, getAllDetailsOfUser } = require("../controllers/userController.js")
const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", authMiddleware, signIn);
router.get('/:uid', getAllDetailsOfUser)

module.exports = router;
