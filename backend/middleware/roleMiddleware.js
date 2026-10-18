/**
 * Middleware: Role-based access control.
 * Usage: requireRole("admin") or requireRole("admin", "doctor")
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
        error: "UNAUTHORIZED"
      });
    }

    const userRole = req.user.role ? req.user.role.toLowerCase() : "";
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}. Your role: ${req.user.role}.`,
        error: "FORBIDDEN"
      });
    }

    next();
  };
};

module.exports = { requireRole };
