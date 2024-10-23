const express = require('express');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

const bcrypt = require('bcrypt'); 

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  async function(username, password, done) {
    try {
      // Find the user by username
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



passport.serializeUser(function(user, done) {
  done(null, user.id); // Save the user's ID to the session
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id); // Find the user by ID
    done(null, user); // Attach the user to the request
  } catch (err) {
    done(err);
  }
});

// error handling

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error('User not found'));
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});



// Registration
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.redirect('/auth/login');
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
