const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const authRoutes = require('./routes/auth');
const User = require('./models/User');


mongoose.connect('mongodb://127.0.0.1:27017/devsecure', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// Configure express-session middleware
app.use(
    session({
      secret: 'spartan01', // Replace with a secure secret key
      resave: false,
      saveUninitialized: false,
    })
  );

// Configure Passport
app.use(passport.initialize());
app.use(passport.session());

// Define a User model (you need to define this model)

// Passport local strategy configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Define routes
app.use('/auth', authRoutes);

// Define a default route for the root URL
app.get('/', (req, res) => {
  res.redirect('/landing');
});

// Define a landing page route
app.get('/landing', (req, res) => {
  res.sendFile(__dirname + '/views/landing.html');
});

// Define a dashboard page route (protected)
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/views/dashboard.html');
});

// Middleware to check if a user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

// Handle connection events
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
