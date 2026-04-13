/*
  Keyla Paguaga Jarquin

  This file creates a reusable validation middleware.
  It is used to check incoming request data before it reaches the route handlers.
  The middleware uses validator functions that return cleaned data along with
  any validation errors. If there are errors, the request is stopped and a response
  is sent back. If not, the cleaned data is passed forward.
*/

// General validation middleware
// It expects a validator function that returns:
// { value: sanitizedData, errors: [] }

module.exports = function(validatorFn) {
  return function(req, res, next) {
    try {
      // Call the validator function with the request body
      var result = validatorFn(req.body);

      // If there are validation errors, send a 400 response with the details
      if (result.errors && result.errors.length > 0) {
        return res.status(400).json({
          status: 400,
          error: 'Validation failed',
          details: result.errors
        });
      }

      // Save the cleaned data into req.validated so it can be used later safely
      req.validated = result.value || {};

      // Move on to the next middleware or route
      next();
    } catch (err) {
      // If something unexpected happens, pass it to the error handler
      next(err);
    }
  };
};