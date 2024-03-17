const User = require("../model/User");
const admin = require("../config/firebaseCofig.js");

async function authMiddleware(request, response, next) {
  const headerToken = request.headers.authorization;
  try {
    const decodedToken = await admin.auth().verifyIdToken(headerToken);
    // console.log(decodedToken)

    if (!decodedToken) {
      return res
        .status(403)
        .send({ error: "Oops! It seems like you're not authorized for this request. Please try refreshing the page or signing in to the app again.", success: false });
    }
    const uid = decodedToken.uid;
    request.body["uid"] = uid;
    request.body["profileImage"] = decodedToken?.picture;
    next();
  } catch (error) {
    // console.log(error.message)
    response.status(500).send({ error: "Your token has expired. Please sign in again.", success: false });
  }
}

async function isUserExistMiddleware(req, res, next) {
  try {
    const { uid } = req.body;
    const user = await User.findOne({ uid, isActive: true });
    if (user) {
      console.log("userId:", user._id);
      return res
        .status(409)
        .send({ error: "User already exists.", success: true, userId: user._id });
    }
    next();
  } catch (error) {
    res.send(500).send({
      error: "User validation failed, please try again",
      success: false,
    });
  }
}

async function isShopAuthorized(req, res, next) {
  const { from, password, email } = req.body; // assuming 'email' is also coming from the request body
  try {
    const shopKeeper = await User.findOne({ uid: from });
    if (
      !shopKeeper ||
      shopKeeper.password !== password ||
      shopKeeper.email !== email
    ) {
      return res.status(400).send({
        error:
          "Unauthorized: You are not recognized as a shopkeeper. Please review your details.",
        success: false,
      });
    }
    console.log(shopKeeper);
    next();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        error: "Authorization failed. Please try again.",
        success: false,
      });
  }
}

module.exports = { authMiddleware, isUserExistMiddleware, isShopAuthorized };
