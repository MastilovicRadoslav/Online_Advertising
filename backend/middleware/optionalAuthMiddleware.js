// middleware/optionalAuthMiddleware.js
const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Ako je token loš, ignoriši ga i pusti bez auth-a
      req.user = null;
    }
  }
  next();
};

module.exports = optionalAuth;
