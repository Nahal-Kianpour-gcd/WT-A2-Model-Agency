/*
Nahal Kianpour

File that sets up the underlying Express application.
It brings together the main middleware, database connection, session handling, routing files, and error handling into one working server.
*/

require('dotenv').config({ quiet: true }); 
// Retrieve environment variables from the .env file so confidential values such as database and session settings are not hardcoded

var createError = require('http-errors'); // used to generate HTTP errors (such as the 404 error)
var express = require('express'); //the main Express framework
var path = require('path'); // handles file paths
var cookieParser = require('cookie-parser'); // parses cookies from requests
var logger = require('morgan'); // logs HTTP requests (useful in dev)

var indexRouter = require('./routes/index'); // main route
var usersRouter = require('./routes/users'); // auth/user routes
var modelsRouter = require('./routes/models'); // model CRUD routes

var errorHandler = require('./middleware/errorHandler'); // custom error handler
var db = require('./db'); // database connection
var session = require('express-session'); // session management
var MongoStore = require('connect-mongo').MongoStore; // store sessions in MongoDB

var app = express(); // create Express app

// Nahal Kianpour 
// Connect to the database when the application starts so the backend can access the stored data
db.connect().catch(function(err) {
  console.error('DB connect error:', err && err.message);
});

// view engine setup (mainly for error pages)
app.set('views', path.join(__dirname, 'views')); // Specify the folder where view templates are stored
app.set('view engine', 'jade'); // Use Jade as the template engine for non-API error rendering

// Register general middleware used by the application
app.use(logger('dev')); // Log each request in the terminal to help with testing and debugging
app.use(express.json()); // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse form data submitted through URL-encoded requests
app.use(cookieParser()); // Read cookie values from incoming requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files such as images, stylesheets, or client files from the public folder

// Session configuration applied for authentication
// Stores session data in MongoDB to ensure login state stays the same between requests
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret', // secret key for signing the session
  resave: false, // prevents unnecessary session updates
  saveUninitialized: false, // avoids storing empty sessions
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/modelagency' // MongoDB session store
  }),
  cookie: {
    secure: app.get('env') === 'production' // enables secure cookies in production only
  }
}));

// Nahal Kianpour
// Register route handlers so each part of the application will be accessible by its URL
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/models', modelsRouter);

// Recognize requests for undefined routes and display a 404 error to the error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// Use custom error handler first to return consistent JSON responses for API errors
app.use(errorHandler);

// General error handler for any unhandled errors
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // show full error only in development

  res.status(err.status || 500);

  // If request is for API or expects JSON, return JSON response
  if (req.originalUrl.indexOf('/api/') === 0 || req.headers.accept === 'application/json') {
    return res.json({
      status: err.status || 500,
      error: err.message || 'Server error'
    });
  }

  // Otherwise render default error page
  res.render('error');
});

module.exports = app; // export app for use in server setup