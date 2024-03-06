const User = require("../model/User")
const admin = require("../config/firebaseCofig.js");

async function authMiddleware(request, response, next) {
  const headerToken = request.headers.authorization;

  try {
    const decodedToken = await admin.auth().verifyIdToken(headerToken);
    console.log(decodedToken.uid)
    if (decodedToken) {
      const uid = decodedToken.uid;
      request.body["uid"] = uid;
    }
    next();
  } catch (error) {
    response.status(401)
      .send({ message: "Please signUp first", error: error.message });
  }
}

async function isUserExistMiddleware(req, res, next) {
  try {
    const { uid } = req.body;
    console.log(uid)
    const user = await User.findOne({ uid, isActive: true });
    if (user) {
      console.log("userId:", user._id);
      return res.status(200).send({ message: "User already exist", success: true, userId: user._id })
    }
    next();
  } catch (error) {
    res.send(400).send({ message: `something went wrong ${error.message}`, success: false })
  }
}

module.exports = { authMiddleware, isUserExistMiddleware };
