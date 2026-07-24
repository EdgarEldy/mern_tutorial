// Implemented in feature/api/auth.
// This middleware verifies the JWT sent in Authorization: Bearer <token>
// and attaches the decoded user to req.user.
// Usage: router.get('/me', protect, controller.getMe)

const protect = (req, res, next) => {
  next(new Error('auth.middleware not yet implemented — see feature/api/auth'));
};

module.exports = { protect };
