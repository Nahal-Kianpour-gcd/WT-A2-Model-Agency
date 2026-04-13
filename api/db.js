/*
  Keyla Paguaga Jarquin

This file controls the MongoDB connection for the backend using Mongoose.
*/

var mongoose = require('mongoose'); // Import Mongoose to manage MongoDB connections and database queries

var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/modelagency'; // Use the MongoDB URI from the environment file, otherwise fall back to a local database for development

mongoose.connection.on('connected', function() {
  console.log('Mongoose connected successfully');
}); // Provide a success message when the database connection is successful

mongoose.connection.on('error', function(err) {
  console.error('Mongoose connection error:', err && err.message);
}); // Display an error message if the database connection fails

// Export both the Mongoose object and a reusable connect() function to enable the application can initialise the database connection from one central file
module.exports = {
  mongoose: mongoose,
  connect: function() {
    if (mongoose.connection.readyState) return Promise.resolve(mongoose); // Avoid opening a new connection if one already exists
    return mongoose.connect(mongoUri).then(function() {
      return mongoose; // Return the connected mongoose instance after a successful connection
    });
  }
};