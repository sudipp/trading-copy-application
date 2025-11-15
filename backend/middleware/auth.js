const { verifyToken, extractTokenFromHeader } = require('../utils/jwtUtils');
const { User } = require('../models');

/**
 * Authentication middleware to verify JWT tokens
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: error.message || 'Invalid token' });
  }
}

module.exports = { authenticate };

