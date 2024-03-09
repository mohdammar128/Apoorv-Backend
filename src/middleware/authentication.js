const User = require("../model/User")
const admin = require("../config/firebaseCofig.js");

async function authMiddleware(request, response, next) {
  const headerToken = request.headers.authorization;
  console.log("asdasnfnlkn")
  
  // const enableAuth = process.env.ENABLE_AUTH;
  // if (enableAuth === 'false')
  //   return next();
  try {
    const decodedToken = await admin.auth().verifyIdToken(headerToken);
    console.log(decodedToken)
    if (!decodedToken) {
      return res.status(403).send({ error: "not_authorized! signup first", success: false });
    }
    const uid = decodedToken.uid;
    request.body["uid"] = uid;
    request.body["profileImage"]=decodedToken?.photoUrl;
    next();
  } catch (error) {
    // console.log(error.message)
    response.status(500)
      .send({ error: "Token expired", success: false });
  }
}

async function isUserExistMiddleware(req, res, next) {
  try {
    const { uid } = req.body;
    console.log(uid)
    const user = await User.findOne({ uid, isActive: true });
    if (user) {
      console.log("userId:", user._id);
      return res.status(409).send({ error: "User already exist", success: true, userId: user._id })
    }
    next();
  } catch (error) {
    res.send(500).send({ error: "User validation failed ,please try again", success: false })
  }
}

module.exports = { authMiddleware, isUserExistMiddleware };
