// controllers/authController.js
const passport = require('passport');
const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

// Local strategy for username and password login
passport.use(new LocalStrategy({
  usernameField: 'email',
}, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Invalid email' });
    }
    user.comparePassword(password, (compareErr, isMatch) => {
      if (compareErr) {
        return done(compareErr);
      }
      if (!isMatch) {
        return done(null, false, { message: 'Invalid password' });
      }
      return done(null, user);
    });
  });
}));

// JWT strategy for token-based authentication
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: 'your-secret-key',
}, (payload, done) => {
  User.findById(payload.userId, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });
}));
