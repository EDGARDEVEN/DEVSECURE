// app.js
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

mongoose.connect('mongodb://localhost/your-database-name', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const app = express();

// Configure Passport
app.use(passport.initialize());

// Define JWT strategy
require('./controllers/authController');

// Define routes
app.use('/auth', authRoutes);

// Handle connection events
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
