const { User } = require('../models');
const { hashPassword, verifyPassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');
const { generateResetToken, hashToken, sendPasswordResetEmail, sendPasswordResetConfirmation } = require('../services/emailService');

/**
 * Register a new user
 */
async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user has password (OAuth users might not)
    if (!user.password) {
      return res.status(401).json({ message: 'Please use OAuth to login' });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current user profile
 */
async function getMe(req, res, next) {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user profile
 */
async function updateMe(req, res, next) {
  try {
    const { name } = req.body;
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) {
      user.name = name;
      await user.save();
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logout (client-side token removal, but we can invalidate if needed)
 */
async function logout(req, res, next) {
  try {
    // For JWT, logout is typically handled client-side by removing the token
    // If using refresh tokens, we could invalidate them here
    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle OAuth callback success
 */
async function oauthCallback(req, res, next) {
  try {
    // User is attached to req by passport
    const user = req.user;
    
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (error) {
    next(error);
  }
}

/**
 * Request password reset
 */
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    // Check if user is OAuth user
    if (user.oauthProvider) {
      return res.status(400).json({ 
        message: `This account uses ${user.oauthProvider} authentication. Please use ${user.oauthProvider} to login.` 
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const hashedToken = hashToken(resetToken);
    
    // Set token expiry (1 hour from now)
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    // Save hashed token to database
    await user.update({
      resetToken: hashedToken,
      resetTokenExpiry: tokenExpiry
    });

    // Send email
    await sendPasswordResetEmail(user.email, resetToken, user.name);

    res.json({ 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    next(error);
  }
}

/**
 * Reset password with token
 */
async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Hash the provided token to compare with stored hash
    const hashedToken = hashToken(token);

    // Find user with valid token
    const user = await User.findOne({
      where: {
        resetToken: hashedToken
      }
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear reset token
    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    });

    // Send confirmation email
    await sendPasswordResetConfirmation(user.email, user.name);

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  logout,
  oauthCallback,
  forgotPassword,
  resetPassword
};

