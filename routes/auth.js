const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

// Passport local strategy for authentication
passport.use(new LocalStrategy(
  async function(username, password, done) {
    try {
      const user = await User.findOne({ username });

      // If user not found
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      // If everything is good, return the user
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize and deserialize user
passport.serializeUser(function(user, done) {
  done(null, user.id); // Save the user's ID to the session
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id); // Find the user by ID
    if (!user) {
      return done(new Error('User not found'));
    }
    done(null, user); // Attach the user to the request
  } catch (err) {
    done(err);
  }
});

// Registration
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});

// Login
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/resources',
  failureRedirect: '/auth/login',
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
