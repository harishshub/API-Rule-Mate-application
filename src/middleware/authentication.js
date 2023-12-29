
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");

function AuthenticationToken(req, res, next) {
  const token = req.header("Auth");

  if (!token) {
    console.log("Access Denied: Token not found");
    return res.status(401).json({ message: "Access Denied" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log("Invalid Token: ", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

module.exports = AuthenticationToken;
