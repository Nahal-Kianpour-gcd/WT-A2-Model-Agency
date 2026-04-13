/*
  Thanh Phuong Hoang
  This file defines validation logic for creating and updating model records.
  It validates and cleans incoming request data before it is processed or stored
  in the database.
*/

// Validation for model routes
// Ensures server-side input validation as required in the assignment

// Helper function to normalize string input
// Converts value to string and trims whitespace
function normalizeString(value) {
  if (value === undefined || value === null) return undefined;
  return String(value).trim();
}

// Helper function to validate email format
// Returns true if email is valid or not provided
function validateEmail(value) {
  if (value === undefined || value === null || value === '') return true;
  return /\S+@\S+\.\S+/.test(String(value).trim());
}

// Validation schema for creating a model (POST request)
exports.createSchema = function(body) {
  var errors = [];
  var value = {};

  // Normalize and convert input values
  value.name = normalizeString(body.name);
  value.age = body.age !== undefined ? Number(body.age) : undefined;
  value.email = normalizeString(body.email);
  value.heightCm = body.heightCm !== undefined && body.heightCm !== '' ? Number(body.heightCm) : undefined;
  value.category = normalizeString(body.category);
  value.location = normalizeString(body.location);
  value.imageUrl = normalizeString(body.imageUrl);
  value.bio = normalizeString(body.bio);
  value.availability = normalizeString(body.availability);
  value.agency = normalizeString(body.agency);

  // Name is required
  if (!value.name) {
    errors.push('Name is required');
  }
// Age is required and must be a valid number
if (value.age === undefined || Number.isNaN(value.age)) {
  errors.push('Age is required and must be a number');
} else if (value.age <= 0) {
  errors.push('Age must be greater than 0');
}

// Validate email only if provided
if (value.email && !validateEmail(value.email)) {
  errors.push('Email format is invalid');
}

// Validate height only if provided
if (body.heightCm !== undefined && body.heightCm !== '') {
  if (Number.isNaN(value.heightCm)) {
    errors.push('HeightCm must be a number');
  } else if (value.heightCm <= 0) {
    errors.push('HeightCm must be greater than 0');
  }
}

// Return cleaned values and any validation errors
return { value: value, errors: errors };
};

// Validation schema for updating a model (PUT request)
exports.updateSchema = function(body) {
  var errors = [];
  var value = {};

  // Validate and normalize name if provided
  if (body.name !== undefined) {
    value.name = normalizeString(body.name);
    if (!value.name) {
      errors.push('Name cannot be empty');
    }
  }

  // Validate age if provided
  if (body.age !== undefined) {
    value.age = Number(body.age);
    if (Number.isNaN(value.age)) {
      errors.push('Age must be a number');
    } else if (value.age <= 0) {
      errors.push('Age must be greater than 0');
    }
  }

  // Validate email if provided
  if (body.email !== undefined) {
    value.email = normalizeString(body.email);
    if (value.email && !validateEmail(value.email)) {
      errors.push('Email format is invalid');
    }
  }

  // Validate height if provided
  if (body.heightCm !== undefined) {
    if (body.heightCm === '') {
      value.heightCm = undefined; // allow clearing the value
    } else {
      value.heightCm = Number(body.heightCm);
      if (Number.isNaN(value.heightCm)) {
        errors.push('HeightCm must be a number');
      } else if (value.heightCm <= 0) {
        errors.push('HeightCm must be greater than 0');
      }
    }
  }

  // Normalize optional fields if they are included in the request
  if (body.category !== undefined) value.category = normalizeString(body.category);
  if (body.location !== undefined) value.location = normalizeString(body.location);
  if (body.imageUrl !== undefined) value.imageUrl = normalizeString(body.imageUrl);
  if (body.bio !== undefined) value.bio = normalizeString(body.bio);
  if (body.availability !== undefined) value.availability = normalizeString(body.availability);
  if (body.agency !== undefined) value.agency = normalizeString(body.agency);

  // Ensure that at least one field is being updated
  if (Object.keys(value).length === 0) {
    errors.push('At least one field is required for update');
  }

  // Return cleaned values and any validation errors
  return { value: value, errors: errors };
};