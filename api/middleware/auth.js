/*
  Trinity Kendi

  The file explains authentication middleware.
  It attaches the current user to req.user for use in protected routes.
  It first checks the session for a logged-in user.
  If not found, it falls back to request headers (for testing purposes).
*/

// Authentication middleware
// Checks session first, then falls back to headers if needed
module.exports = function(req, res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user; // use session user
    return next();
  }

  var userId = req.header('x-user-id'); // get user id from headers
  var userRole = req.header('x-user-role'); // get user role from headers

  if (userId) {
    req.user = {
      _id: userId,
      role: userRole || 'viewer' // default role
    };
  }

  next(); // continue request
};