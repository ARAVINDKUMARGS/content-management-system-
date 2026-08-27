const jwt = require('jsonwebtoken');
const userStore = require('../models/userStore');

/**
 * Reusable JWT Authentication Middleware for the entire Lumen project.
 */
const authenticateUser = async (req, res, next) => {
  let token;

  // 1. Extract Bearer token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. No authorization token provided.',
    });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({
      success: false,
      message: 'Server configuration error: JWT_SECRET is not configured.',
    });
  }

  try {
    // 2. Verify JWT signature & expiration using environment secret
    const decoded = jwt.verify(token, jwtSecret);

    // 3. Find user by ID via userStore
    const currentUser = await userStore.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // 4. Attach authenticated user to request
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please sign in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token. Access denied.',
    });
  }
};

/**
 * Reusable Role-Based Authorization Middleware.
 */
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking permissions.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to perform this action. Required: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  authorizeRole,
  protect: authenticateUser,
  restrictTo: authorizeRole,
};
