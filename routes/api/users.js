const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const keys = require('../../config/keys');
const passport = require('passport');
const cors = require('cors');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User Model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests user route
// @access  Public
router.get('/test', async (req, res) => res.json({ msg: 'User Works' }));


// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const user = await User.findOne({ email: req.body.email })
  if (user) {
    errors.email = 'Email already exists';
    return res.status(400).json(errors)
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    });

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newUser.password, salt);
      newUser.password = hash;  // password hashing
      const user = await newUser.save()
      return res.json({
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      return error;
    }
  }
});


// @route   POST api/users/login
// @desc    Login user / return token
// @access  Public
router.post('/login', async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body)

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  
  const { email, password } = req.body

  // find user by email
  const user = await User.findOne({ email })
  if (!user) {
    errors.email = 'User not found';
    return res.status(404).json(errors);
  }

  // Check Password
  const isMatch = await bcrypt.compare(password, user.password)
  if (isMatch) {
    // User matched
    const payload = { id: user.id, name: user.name }; // create JWT Payload

    // Sign Token
    jwt.sign(
      payload,
      keys.secretOrKey,
      { expiresIn: keys.jwtExpiry },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          // token: 'Bearer ' + token
          token: token
        });
      });
  } else {
    return res.status(400).json({ password: 'Password Incorrect' });
  }
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    })
  }
)

module.exports = router;