// Implemented in feature/api/auth.
// Verifies the JWT from Authorization: Bearer <token> and attaches the decoded user to req.user.
// Usage: router.get('/me', protect, controller.getMe)

const protect = (req, res, next) => {
  next(new Error('auth.middleware not yet implemented - see feature/api/auth'));
};

module.exports = { protect };
