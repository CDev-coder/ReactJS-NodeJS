// Simplified auth middleware for demo
const authMiddleware = (req, res, next) => {
  // For demo purposes, just continue
  // In real app, you would verify JWT token here
  next();
};

module.exports = authMiddleware;
