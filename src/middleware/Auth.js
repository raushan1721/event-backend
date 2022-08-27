const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  var token = req.headers.authorization;
  token=token.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    req.access_token=token;
    next();
  } catch (err) {
    return res.status(401).json({ errors: [{ msg: "Token is not valid!" }] });
  }
};
