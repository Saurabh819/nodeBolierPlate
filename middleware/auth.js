const jwt = require("jsonwebtoken");
const Admin = require("../model/adminModel");

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user = decoded;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};

// Middleware to check admin role
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied, insufficient permissions' });
      }
      next();
    };
  };

module.exports = {
  protect,
  authorizeRoles,
};