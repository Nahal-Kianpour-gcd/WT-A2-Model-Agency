/*
  Keyla Paguaga Jarquin

  This file defines the User schema for the application.
  It specifies how user data is structured and stored in MongoDB.

  The schema includes fields for authentication such as username,
  email, and password hash, along with a role field for access control.
*/

var mongoose = require('../db').mongoose; // mongoose instance
var Schema = mongoose.Schema; // schema constructor

// Define User schema
var UserSchema = new Schema({ 
  username: { type: String, required: true, trim: true, unique: true }, // unique username (trimmed)
  name: { type: String, trim: true }, // optional name
  email: { type: String, required: true, lowercase: true, trim: true, unique: true }, // unique email (lowercase + trimmed)
  passwordHash: { type: String, required: true }, // hashed password
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'editor' }, // user role
  createdAt: { type: Date, default: Date.now } // creation date
});

// Export User model
module.exports = mongoose.model('User', UserSchema);