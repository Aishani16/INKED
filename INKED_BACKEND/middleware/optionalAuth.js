const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

  } catch (error) {
    // ignore invalid token
  }

  next();
};

module.exports = optionalAuth;