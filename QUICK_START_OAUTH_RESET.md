# Quick Start Guide - OAuth & Password Reset

## 🚀 Quick Setup (5 Minutes)

### 1. Install Dependencies (Already Done ✅)
```bash
cd backend
npm install passport passport-google-oauth20 passport-apple nodemailer
```

### 2. Configure Environment Variables

Copy and update your `.env` file:

```bash
# Backend/.env
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:3001

# For Testing Password Reset (Use Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
SMTP_FROM="Trading Copy" <noreply@tradingcopy.com>

# OAuth (Optional for initial testing)
GOOGLE_CLIENT_ID=get-from-google-console
GOOGLE_CLIENT_SECRET=get-from-google-console
APPLE_CLIENT_ID=get-from-apple-developer
APPLE_TEAM_ID=get-from-apple-developer
APPLE_KEY_ID=get-from-apple-developer
```

### 3. Get Gmail App Password (2 Minutes)

1. Go to [Google Account Settings](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Create new app password for "Mail"
5. Copy password to `SMTP_PASSWORD` in `.env`

### 4. Test Password Reset Flow

```bash
# Start backend
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

1. Navigate to http://localhost:5173/login
2. Click "Forgot password?"
3. Enter your email
4. Check email for reset link
5. Click link and set new password

## 🎯 Feature Usage

### Password Reset Flow

**User Journey:**
```
Login Page → "Forgot password?" → Enter email → 
Check email → Click reset link → Set new password → Login
```

**API Calls:**
```javascript
// 1. Request reset
POST /api/auth/forgot-password
{ "email": "user@example.com" }

// 2. Reset password
POST /api/auth/reset-password
{ "token": "abc123...", "newPassword": "NewPass123!" }
```

### OAuth Login Flow

**User Journey:**
```
Login Page → "Continue with Google/Apple" → 
Authorize → Redirect back → Dashboard
```

**Flow Diagram:**
```
Frontend → Backend OAuth Route → Provider → Callback → 
JWT Generated → Frontend stores token → Dashboard
```

## 🔧 Common Tasks

### Test Password Reset in Development

```javascript
// In development, email preview URL is logged to console
// Check terminal output for:
Preview URL: https://ethereal.email/message/...
```

### Add OAuth Provider (Google)

1. **Google Console:**
   - Go to https://console.cloud.google.com/
   - Create project → Enable Google+ API
   - Credentials → Create OAuth 2.0 Client ID
   - Add redirect: `http://localhost:3001/api/auth/google/callback`

2. **Update .env:**
   ```bash
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

3. **Restart backend** - That's it!

### Customize Email Template

Edit `backend/services/emailService.js`:

```javascript
const mailOptions = {
  from: process.env.SMTP_FROM,
  to: email,
  subject: 'Your Custom Subject',
  html: `
    <!-- Your custom HTML -->
    <a href="${resetUrl}">Reset Password</a>
  `
};
```

## 🐛 Quick Troubleshooting

### Password Reset Email Not Sending

```bash
# Check SMTP credentials
✅ SMTP_USER is valid email
✅ SMTP_PASSWORD is app password (not regular password)
✅ Port 587 is not blocked

# Test SMTP connection
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
});
transporter.verify().then(console.log).catch(console.error);
"
```

### OAuth "redirect_uri_mismatch"

```bash
# Make sure redirect URI matches EXACTLY:
Backend: http://localhost:3001/api/auth/google/callback
Google Console: http://localhost:3001/api/auth/google/callback

# Check for:
- Missing/extra slashes
- http vs https
- Different port numbers
```

### Token Not Working

```javascript
// Check token expiry
// Tokens expire after 1 hour by default

// Check token in database
// Run in psql or Supabase SQL editor:
SELECT reset_token, reset_token_expiry 
FROM users 
WHERE email = 'user@example.com';
```

## 📝 Frontend Integration Examples

### Using Password Reset

```tsx
import { useState } from 'react';
import api from './services/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/auth/forgot-password', { email });
    alert('Check your email!');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button>Send Reset Link</button>
    </form>
  );
}
```

### Using OAuth Login

```tsx
function OAuthButton({ provider }) {
  const handleClick = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    window.location.href = `${apiUrl}/api/auth/${provider}`;
  };
  
  return (
    <button onClick={handleClick}>
      Continue with {provider}
    </button>
  );
}

// Usage
<OAuthButton provider="google" />
<OAuthButton provider="apple" />
```

## 🔐 Security Best Practices

### Password Requirements

```javascript
// Enforce in frontend validation
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character (recommended)

// Backend validation in authController.js
if (password.length < 8) {
  return res.status(400).json({ 
    message: 'Password must be at least 8 characters' 
  });
}
```

### Rate Limiting (TODO - Should Be Added)

```javascript
// Install: npm install express-rate-limit

const rateLimit = require('express-rate-limit');

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per window
  message: 'Too many reset requests, try again later'
});

router.post('/forgot-password', resetLimiter, authController.forgotPassword);
```

## 📊 Monitoring & Logs

### Check Password Reset Requests

```javascript
// Add logging in authController.js
console.log(`Password reset requested for: ${email}`);
console.log(`Reset token generated, expires: ${tokenExpiry}`);
```

### Check OAuth Logins

```javascript
// Add logging in passport.js
console.log(`OAuth login: ${profile.emails[0].value} via ${provider}`);
```

## 🚀 Production Deployment

### Pre-Deployment Checklist

```bash
✅ Set NODE_ENV=production
✅ Use production SMTP service (SendGrid/Mailgun)
✅ Configure HTTPS
✅ Update OAuth redirect URIs to production URLs
✅ Use secure JWT_SECRET
✅ Add rate limiting
✅ Monitor email deliverability
✅ Test OAuth flow in production
```

### Environment Variables for Production

```bash
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
API_URL=https://api.your-domain.com

# Use production SMTP
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key

# Production OAuth
GOOGLE_CLIENT_ID=prod-client-id
GOOGLE_CLIENT_SECRET=prod-secret
```

## 📚 Additional Resources

- **Full Setup Guide:** `OAUTH_PASSWORD_RESET_SETUP.md`
- **Implementation Summary:** `OAUTH_IMPLEMENTATION_SUMMARY.md`
- **Main README:** `README.md`

## 🆘 Need Help?

1. Check `OAUTH_PASSWORD_RESET_SETUP.md` for detailed instructions
2. Review code comments in:
   - `backend/config/passport.js`
   - `backend/services/emailService.js`
   - `backend/controllers/authController.js`
3. Check console logs for error messages
4. Verify environment variables are loaded correctly

## ✅ Quick Test Checklist

Before committing:
- [ ] Password reset email sends successfully
- [ ] Reset link works and redirects correctly
- [ ] New password works for login
- [ ] OAuth buttons visible on login page
- [ ] No console errors in frontend
- [ ] No errors in backend logs
- [ ] All routes return expected responses

---

**Status:** ✅ All features implemented and ready for testing

**Next Steps:** 
1. Configure SMTP for password reset testing
2. (Optional) Set up OAuth providers for Google/Apple
3. Test both flows end-to-end
4. Add unit tests (tasks 2.22-2.24)
