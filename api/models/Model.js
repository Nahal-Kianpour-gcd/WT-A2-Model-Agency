/*
  Keyla Paguaga Jarquin
  
  This file defines the Model schema for the application.
  It specifies how model profile data is structured and stored in MongoDB.

  It includes fields for basic model details as well as tracking fields
  for create, update, and delete actions. Soft delete is used to mark
  records as deleted without removing them from the database.
*/

var mongoose = require('../db').mongoose; // mongoose instance
var Schema = mongoose.Schema; // schema constructor

// Helper function to validate email format (optional field)
var emailValidator = function(v) {
  if (!v) return true; // allow empty values
  var re = /\S+@\S+\.\S+/;
  return re.test(v); // check email format
};

// Define Model schema
var ModelSchema = new Schema({
  name: { type: String, required: true, trim: true }, // required name (trimmed)
  age: { type: Number, required: true }, // required age
  email: { type: String, validate: [emailValidator, 'Invalid email format'] }, // optional email with validation
  heightCm: { type: Number }, // height in cm
  category: { type: String, trim: true }, // model category
  location: { type: String, trim: true }, // model location
  imageUrl: { type: String, trim: true }, // profile image URL
  bio: { type: String, trim: true }, // model bio
  availability: { type: String, trim: true }, // availability status
  agency: { type: String, trim: true }, // agency name
  createdAt: { type: Date, default: Date.now }, // creation timestamp
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // created by user reference
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // last updated by user
  deleted: { type: Boolean, default: false }, // soft delete flag
  deletedAt: { type: Date }, // deletion timestamp
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User' } // deleted by user reference
});

// Export Model
module.exports = mongoose.model('Model', ModelSchema);