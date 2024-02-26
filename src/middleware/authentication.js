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
    const response = firebase.auth.verifyIdToken(token);
    if (response) next();
  } catch (error) {
    response.send({ message: "Please signUp first", error: error.message }).status(403);
  }
}

module.exports = authMiddleware;
