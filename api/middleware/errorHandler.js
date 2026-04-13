/*
  Keyla Paguaga Jarquin

  This file sets up a central error handling middleware for the app.
  The idea is to handle all errors in one place and send them back in a
  consistent JSON format.
*/

// Central error handler for API responses
module.exports = function(err, req, res, next) {
  console.error(err); // Print the error in the console for debugging

  // Check for duplicate key errors from MongoDB (for example, when a unique field is repeated)
  if (err && err.code === 11000) {
    return res.status(400).json({
      status: 400,
      error: 'Duplicate value already exists'
    });
  }

  // Check for Mongoose validation errors (like missing or invalid fields)
  if (err && err.name === 'ValidationError') {
    var details = Object.keys(err.errors).map(function(key) {
      return err.errors[key].message; // Get each validation error message
    });

    return res.status(400).json({
      status: 400,
      error: 'Validation failed',
      details: details
    });
  }

  // For any other errors, send a general error response
  res.status(err.status || 500).json({
    status: err.status || 500,
    error: err.message || 'Internal server error'
  });
};