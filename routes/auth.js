const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', (req, res, next) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });

  user.save()
    .then(() => {
      res.status(201).json({ message: 'User registered successfully' });
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.login(user, { session: false }, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      const token = jwt.sign({ userId: user.id }, 'your-secret-key');
      return res.json({ token });
    });
  })(req, res);
});

module.exports = router;
