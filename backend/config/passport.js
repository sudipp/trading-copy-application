const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple');
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL || 'http://localhost:3001'}/api/auth/google/callback`,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({
            where: {
              oauthProvider: 'google',
              oauthId: profile.id
            }
          });

          if (!user) {
            // Check if user exists with this email
            const existingUser = await User.findOne({
              where: { email: profile.emails[0].value }
            });

            if (existingUser) {
              // Link Google account to existing user
              user = await existingUser.update({
                oauthProvider: 'google',
                oauthId: profile.id
              });
            } else {
              // Create new user
              user = await User.create({
                email: profile.emails[0].value,
                name: profile.displayName,
                oauthProvider: 'google',
                oauthId: profile.id,
                password: null // No password for OAuth users
              });
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Apple OAuth Strategy
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET) {
  passport.use(
    new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        callbackURL: `${process.env.API_URL || 'http://localhost:3001'}/api/auth/apple/callback`,
        keyID: process.env.APPLE_KEY_ID,
        privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION || './config/apple-key.p8',
        scope: ['name', 'email'],
        passReqToCallback: false
      },
      async (accessToken, refreshToken, idToken, profile, done) => {
        try {
          // Apple provides user info only on first login
          const appleId = idToken.sub;
          const email = idToken.email;
          const name = profile.name ? `${profile.name.firstName} ${profile.name.lastName}` : email.split('@')[0];

          // Check if user already exists
          let user = await User.findOne({
            where: {
              oauthProvider: 'apple',
              oauthId: appleId
            }
          });

          if (!user) {
            // Check if user exists with this email
            const existingUser = await User.findOne({
              where: { email }
            });

            if (existingUser) {
              // Link Apple account to existing user
              user = await existingUser.update({
                oauthProvider: 'apple',
                oauthId: appleId
              });
            } else {
              // Create new user
              user = await User.create({
                email,
                name,
                oauthProvider: 'apple',
                oauthId: appleId,
                password: null
              });
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

module.exports = passport;
