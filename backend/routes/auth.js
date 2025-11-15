const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authenticate, authController.logout);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.put('/me', authenticate, authController.updateMe);

// OAuth routes (to be implemented)
router.get('/oauth/google', (req, res) => {
  res.status(501).json({ message: 'Google OAuth not yet implemented' });
});

router.get('/oauth/google/callback', (req, res) => {
  res.status(501).json({ message: 'Google OAuth callback not yet implemented' });
});

router.get('/oauth/apple', (req, res) => {
  res.status(501).json({ message: 'Apple OAuth not yet implemented' });
});

router.get('/oauth/apple/callback', (req, res) => {
  res.status(501).json({ message: 'Apple OAuth callback not yet implemented' });
});

// Password reset routes (to be implemented)
router.post('/forgot-password', (req, res) => {
  res.status(501).json({ message: 'Password reset not yet implemented' });
});

router.post('/reset-password', (req, res) => {
  res.status(501).json({ message: 'Password reset not yet implemented' });
});

module.exports = router;

