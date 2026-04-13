/*

  Trinity Kendi

  This file defines validation logic for user authentication routes.
  It is used to validate input data for registration and login requests
  before the data is processed by the application.

*/

// Validation for authentication routes (register and login)
// Ensures user input is checked on the server side

// Helper function to normalize text input
// Converts value to string and trims whitespace
function normalizeString(value) {
  if (value === undefined || value === null) return undefined;
  return String(value).trim();
}

// Helper function to validate email format using a basic pattern
function validateEmail(value) {
  return /\S+@\S+\.\S+/.test(String(value).trim());
}
// Validation schema for user registration
// Checks required fields before creating a new user
exports.registerSchema = function(body) {
  var errors = [];
  var value = {};

  // Normalize input values
  value.username = normalizeString(body.username);
  value.name = normalizeString(body.name);
  value.email = normalizeString(body.email);
  value.password = body.password !== undefined ? String(body.password) : undefined;

  // Username is required
  if (!value.username) {
    errors.push('Username is required');
  }

  // Email is required and must be valid
  if (!value.email) {
    errors.push('Email is required');
  } else if (!validateEmail(value.email)) {
    errors.push('Email format is invalid');
  }

  // Password is required and must be at least 6 characters
  if (!value.password) {
    errors.push('Password is required');
  } else if (value.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  // Return the cleaned values together with any validation errors found
  return { value: value, errors: errors };
};

// Validation schema for user login
// Checks required fields before processing login
exports.loginSchema = function(body) {
  var errors = [];
  var value = {};

  // Normalize input values
  value.username = normalizeString(body.username);
  value.password = body.password !== undefined ? String(body.password) : undefined;

  // Username is required
  if (!value.username) {
    errors.push('Username is required');
  }

  // Password is required
  if (!value.password) {
    errors.push('Password is required');
  }

  // Return cleaned values and any validation errors
  return { value: value, errors: errors };
};