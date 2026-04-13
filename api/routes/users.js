/*

  Trinity Kendi

  This file defines the authentication routes for the application.
  It handles user registration, login, logout, and session checking.

  These routes are integrated with MongoDB, validation middleware,
  password hashing, and session handling to support user authentication.

*/

var express = require('express'); // Express framework
var router = express.Router(); // router for authentication routes
var User = require('../models/User'); // user model
var bcrypt = require('bcryptjs'); // password hashing
var validate = require('../middleware/validate'); // validation middleware
var validators = require('../validators/userValidator'); // validation rules for auth routes

// Trinity Kendi
// POST /api/users/register
// Creates a new user after validating input, hashing the password, and starting a session
router.post('/register', validate(validators.registerSchema), async function(req, res, next) {
  try {
    var body = req.validated;

    // Check if a user with the same username or email already exists
    var existingUser = await User.findOne({
      $or: [
        { username: body.username },
        { email: body.email }
      ]
    }).exec();

    if (existingUser) {
      return res.status(400).json({
        status: 400,
        error: 'User already exists'
      });
    }

    // Hash password before storing it
    var hash = await bcrypt.hash(body.password, 10);

    // Create new user document with validated data
    var newUser = new User({
      username: body.username,
      name: body.name,
      email: body.email,
      passwordHash: hash
    });

    await newUser.save();

    // Create session to keep user authenticated
    req.session.user = {
      _id: newUser._id,
      username: newUser.username,
      role: newUser.role
    };

    // Return user details (excluding sensitive fields)
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      role: newUser.role
    });
  } catch (err) {
    next(err);
  }
});

// Trinity Kendi
// POST /api/users/login
// Authenticates a user by checking the submitted credentials
// If successful, a session is created to allow access to protected routes
router.post('/login', validate(validators.loginSchema), async function(req, res, next) {
  try {
    var body = req.validated;

    // Find user by username
    var foundUser = await User.findOne({ username: body.username }).exec();

    if (!foundUser) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid credentials'
      });
    }

    // Compare input password with stored hash
    var passwordMatches = await bcrypt.compare(body.password, foundUser.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid credentials'
      });
    }

    // Store user data in session
    req.session.user = {
      _id: foundUser._id,
      username: foundUser.username,
      role: foundUser.role
    };

    // Return user details
    res.json({
      _id: foundUser._id,
      username: foundUser.username,
      role: foundUser.role
    });
  } catch (err) {
    next(err);
  }
});

// Trinity Kendi
// POST /api/users/logout
// Logs out the user by destroying the current session
router.post('/logout', function(req, res) {
  req.session.destroy(function() {
    res.json({ message: 'Logged out' });
  });
});

// Trinity Kendi
// GET /api/users/me
// Returns the currently authenticated user from the session
router.get('/me', function(req, res) {
  // Check if session and user exist
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      status: 401,
      error: 'Not authenticated'
    });
  }

  // Return session user data
  res.json(req.session.user);
});

// Basic test route to confirm that the users route is working
router.get('/', function(req, res) {
  res.send('users route working');
});

module.exports = router; // Export the router so these routes can be used in the main application