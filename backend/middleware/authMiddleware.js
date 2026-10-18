const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided.",
        error: "UNAUTHORIZED"
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token format.",
        error: "UNAUTHORIZED"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify user still exists and is active
    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "User account not found or deactivated.",
        error: "UNAUTHORIZED"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again.", error: "TOKEN_EXPIRED" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid authentication token.", error: "INVALID_TOKEN" });
    }
    return res.status(500).json({ success: false, message: "Authentication error.", error: error.message });
  }
};

module.exports = { requireAuth };
