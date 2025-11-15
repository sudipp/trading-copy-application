# OAuth and Password Reset Setup Guide

This guide explains how to configure and use OAuth authentication (Google and Apple) and password reset functionality in the Trading Copy Application.

## Table of Contents
- [OAuth Configuration](#oauth-configuration)
  - [Google OAuth Setup](#google-oauth-setup)
  - [Apple Sign In Setup](#apple-sign-in-setup)
- [Email Configuration](#email-configuration)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## OAuth Configuration

### Google OAuth Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API**
   - In the left sidebar, go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized redirect URIs:
     - Development: `http://localhost:3001/api/auth/google/callback`
     - Production: `https://your-domain.com/api/auth/google/callback`
   - Save the Client ID and Client Secret

4. **Update Environment Variables**
   ```bash
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

### Apple Sign In Setup

1. **Enroll in Apple Developer Program**
   - You need an active Apple Developer account ($99/year)

2. **Create an App ID**
   - Go to [Apple Developer Console](https://developer.apple.com/account/)
   - Navigate to "Certificates, Identifiers & Profiles"
   - Create a new App ID with "Sign in with Apple" capability enabled

3. **Create a Services ID**
   - Create a new Services ID
   - Enable "Sign in with Apple"
   - Configure domains and redirect URLs:
     - Development: `localhost:3001`
     - Production: `your-domain.com`
   - Redirect URL: `https://your-domain.com/api/auth/apple/callback`

4. **Create a Private Key**
   - In "Keys" section, create a new key
   - Enable "Sign in with Apple"
   - Download the `.p8` file
   - Save it to `backend/config/apple-key.p8`

5. **Update Environment Variables**
   ```bash
   APPLE_CLIENT_ID=your.services.id
   APPLE_TEAM_ID=your-team-id
   APPLE_KEY_ID=your-key-id
   APPLE_PRIVATE_KEY_LOCATION=./config/apple-key.p8
   ```

## Email Configuration

Password reset functionality requires an SMTP server for sending emails.

### Using Gmail (Development)

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Security > 2-Step Verification

2. **Create an App Password**
   - Go to Security > App passwords
   - Create a new app password for "Mail"
   - Copy the generated password

3. **Update Environment Variables**
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM="Trading Copy App" <noreply@tradingcopy.com>
   ```

### Using Other SMTP Services

**SendGrid**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

**Mailgun**
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
```

**Amazon SES**
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
```

## Environment Variables

Complete `.env` file example:

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth - Apple
APPLE_CLIENT_ID=your.services.id
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_PRIVATE_KEY_LOCATION=./config/apple-key.p8

# URLs
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:3001

# Email/SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM="Trading Copy App" <noreply@tradingcopy.com>

# Stock API
STOCK_API_KEY=your-alpha-vantage-key
STOCK_API_PROVIDER=alpha-vantage
```

## Testing

### Testing OAuth Flow

1. **Google OAuth**
   - Navigate to `/login`
   - Click "Continue with Google"
   - Authorize the application
   - You should be redirected to the dashboard

2. **Apple Sign In**
   - Navigate to `/login`
   - Click "Continue with Apple"
   - Authorize the application
   - You should be redirected to the dashboard

### Testing Password Reset

1. **Request Reset**
   - Navigate to `/login`
   - Click "Forgot password?"
   - Enter your email address
   - Check your email for the reset link

2. **Reset Password**
   - Click the link in the email
   - Enter your new password
   - You should be redirected to login

## Frontend Integration

### OAuth Buttons

The OAuth buttons are integrated into the `LoginForm` component:

```tsx
<button
  type="button"
  onClick={() => handleOAuthLogin('google')}
  className="oauth-button google-button"
>
  Continue with Google
</button>

<button
  type="button"
  onClick={() => handleOAuthLogin('apple')}
  className="oauth-button apple-button"
>
  Continue with Apple
</button>
```

### Password Reset Flow

1. **Forgot Password Page** (`/forgot-password`)
   - User enters email
   - Server sends reset email with token

2. **Reset Password Page** (`/reset-password?token=xxx`)
   - User enters new password
   - Password strength indicator shown
   - Server validates token and updates password

3. **OAuth Callback Page** (`/auth/callback?token=xxx`)
   - Handles OAuth redirect
   - Stores JWT token
   - Redirects to dashboard

## Database Migration

The User model has been updated with password reset fields. Run migrations:

```bash
cd backend
npm run migrate
```

Or manually add these columns to the `users` table:

```sql
ALTER TABLE users ADD COLUMN reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN reset_token_expiry TIMESTAMP;
```

## Security Considerations

1. **HTTPS Required for Production**
   - OAuth requires HTTPS in production
   - Configure SSL certificates for your domain

2. **Environment Variables**
   - Never commit `.env` file to version control
   - Use secure storage for production secrets

3. **Token Expiry**
   - Password reset tokens expire after 1 hour
   - JWT tokens expire based on `JWT_EXPIRES_IN`

4. **Rate Limiting**
   - Consider adding rate limiting to prevent abuse
   - Limit password reset requests per IP/email

## Troubleshooting

### OAuth Issues

**"redirect_uri_mismatch" error**
- Check that the redirect URI in your OAuth console matches exactly
- Include protocol (http/https) and port

**"invalid_client" error**
- Verify Client ID and Client Secret are correct
- Check that OAuth is enabled for your application

### Email Issues

**Emails not sending**
- Check SMTP credentials
- Verify firewall/security group allows SMTP port
- Check spam folder

**"Authentication failed" error**
- For Gmail, use App Password, not regular password
- Enable "Less secure app access" if using regular password

### Apple Sign In Issues

**"invalid_client" error**
- Verify Team ID, Key ID, and Client ID are correct
- Check that the `.p8` file path is correct

**"invalid_grant" error**
- Check redirect URI configuration
- Verify domain configuration in Apple Developer Console

## API Endpoints

### OAuth Endpoints

```
GET  /api/auth/google                  - Initiate Google OAuth
GET  /api/auth/google/callback         - Google OAuth callback
GET  /api/auth/apple                   - Initiate Apple Sign In
POST /api/auth/apple/callback          - Apple Sign In callback
```

### Password Reset Endpoints

```
POST /api/auth/forgot-password         - Request password reset
POST /api/auth/reset-password          - Reset password with token
```

### Request/Response Examples

**Forgot Password Request**
```json
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}
```

**Forgot Password Response**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

**Reset Password Request**
```json
POST /api/auth/reset-password
{
  "token": "abc123...",
  "newPassword": "NewSecurePassword123!"
}
```

**Reset Password Response**
```json
{
  "message": "Password has been reset successfully"
}
```

## Production Deployment

1. **Update Environment Variables**
   - Set `NODE_ENV=production`
   - Use production URLs for `FRONTEND_URL` and `API_URL`
   - Update OAuth redirect URIs to production domains

2. **Configure HTTPS**
   - Obtain SSL certificate
   - Configure reverse proxy (nginx/Apache)

3. **Update OAuth Configurations**
   - Add production redirect URIs to Google Console
   - Add production domains to Apple Developer Console

4. **Configure Email Service**
   - Use production SMTP service (SendGrid, Mailgun, SES)
   - Verify email sending domain

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/your-repo/issues)
- Review the [OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- Review the [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
