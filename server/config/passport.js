const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        profileImage: profile.photos[0].value,
        isVerified: true, // OAuth emails are generally verified
      };

      try {
        let user = await User.findOne({ 
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] 
        });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
      proxy: true,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails ? profile.emails[0].value : `${profile.username}@github.com`;
      const newUser = {
        githubId: profile.id,
        name: profile.displayName || profile.username,
        email: email,
        profileImage: profile.photos[0].value,
        githubLink: profile.profileUrl,
        isVerified: true,
      };

      try {
        let user = await User.findOne({ 
          $or: [{ githubId: profile.id }, { email: email }] 
        });

        if (user) {
          if (!user.githubId) {
            user.githubId = profile.id;
            await user.save();
          }
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});
