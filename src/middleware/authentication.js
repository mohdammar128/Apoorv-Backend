const User = require("../model/User")
const firebase = require("../config/firebaseCofig.js");

async function authMiddleware(request, response, next) {
  const headerToken = request.headers.authorization;
  if (!headerToken) {
    return response.send({ message: "No token provided" }).status(401);
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    response.send({ message: "Invalid token" }).status(401);
  }

  const token = headerToken.split(" ")[1];

  try {
    const decodedToken = firebase.auth.verifyIdToken(token);

    if (decodedToken) {
      const uid = decodedToken.uid;
      req.body["uid"] = uid;
    }
    next();
  } catch (error) {
    response
      .send({ message: "Please signUp first", error: error.message })
      .status(403);
  }
}

async function isUserExistMiddleware(req, res, next) {
  try {
    const { uid } = req.body;
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
