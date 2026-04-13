/*
  Description:
  This file defines the API routes for model-related functionality.
  It includes operations for reading, searching, creating, updating,
  and deleting model records.

  Nahal Kianpour: responsible for read and search functionality,
  including listing models, retrieving by ID, and filtering by fields.
  Thanh Phuong Hoang: responsible for create and update routes.
  Keyla Paguaga Jarquin: responsible for delete route.

*/

var express = require('express'); // Express framework
var router = express.Router(); // router for model routes
var Model = require('../models/Model'); // model schema
var mongoose = require('../db').mongoose; // mongoose instance (for ObjectId checks)
var auth = require('../middleware/auth'); // authentication middleware
var validate = require('../middleware/validate'); // validation middleware
var validators = require('../validators/modelValidator'); // validation rules for models

// Apply authentication middleware to all model routes.
// This allows req.user to be available when a session exists or when fallback headers are used.
router.use(auth);

// Nahal Kianpour 
// GET /api/models/search
// Searches models by name, category, and/or location
// Only returns records that are not soft-deleted
router.get('/search', async function(req, res, next) {
  try {
    var query = { deleted: false };

    // Ensure at least one search field is provided
    if (!req.query.name && !req.query.category && !req.query.location) {
      return res.status(400).json({
        status: 400,
        error: 'Please provide at least one search field'
      });
    }

    // Apply case-insensitive partial match for name if provided
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }

    // Apply case-insensitive partial match for category if provided
    if (req.query.category) {
      query.category = { $regex: req.query.category, $options: 'i' };
    }

    // Apply case-insensitive partial match for location if provided
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }

    // Execute query and return matching results
    var results = await Model.find(query).exec();
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// Nahal Kianpour 
// GET /api/models
// This route retrieves all active model records from the database.
// Soft-deleted records are excluded so only available models are shown.
router.get('/', async function(req, res, next) {
  try {
    var models = await Model.find({ deleted: false }).exec();
    res.json(models);
  } catch (err) {
    next(err);
  }
});

// Nahal Kianpour
// GET /api/models/:id
// Retrieves a single model by its ObjectId
router.get('/:id', async function(req, res, next) {
  try {
    var id = req.params.id;

    // Validate ObjectId format before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid id'
      });
    }

    // Search for the model by id.
    var foundModel = await Model.findById(id).exec();

    // Return a not found response if the model does not exist or has already been soft-deleted.
    if (!foundModel || foundModel.deleted) {
      return res.status(404).json({
        status: 404,
        error: 'Model not found'
      });
    }

    res.json(foundModel);
  } catch (err) {
    next(err);
  }
});

// Thanh Phuong Hoang 
// POST /api/models
// This route creates a new model record after the request data has been validated.
router.post('/', validate(validators.createSchema), async function(req, res, next) {
  try {
    var payload = req.validated || {};

    // If an authenticated user exists, store that user as the creator of the model record.
    if (req.user && req.user._id) {
      payload.createdBy = req.user._id;
    }

    // Create and save the new model document in MongoDB.
    var newModel = new Model(payload);
    await newModel.save();

    // Return the created model with HTTP 201 status.
    res.status(201).json(newModel);
  } catch (err) {
    next(err);
  }
});

// Thanh Phuong Hoang 
// PUT /api/models/:id
// This route updates an existing model record.
// Only the user who created the model or an admin user is allowed to perform the update.
router.put('/:id', validate(validators.updateSchema), async function(req, res, next) {
  try {
    var user = req.user;

    // Updating a model requires the user to be authenticated.
    if (!user) {
      return res.status(401).json({
        status: 401,
        error: 'Authentication required'
      });
    }

    var id = req.params.id;

    // Validate the format of the id before querying the database.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid id'
      });
    }

    // Retrieve the existing model record.
    var existingModel = await Model.findById(id).exec();

    // Return a not found response if the record does not exist or was already soft-deleted.
    if (!existingModel || existingModel.deleted) {
      return res.status(404).json({
        status: 404,
        error: 'Model not found'
      });
    }

    // Check whether the current user is the owner of the record.
    var isOwner = existingModel.createdBy && String(existingModel.createdBy) === String(user._id);

    // Only the owner or an admin is allowed to update the model.
    if (user.role !== 'admin' && !isOwner) {
      return res.status(403).json({
        status: 403,
        error: 'Forbidden: insufficient permissions to update'
      });
    }

    // Apply the validated updates and record which user last updated the document.
    Object.assign(existingModel, req.validated);
    existingModel.updatedBy = user._id;

    await existingModel.save();
    res.json(existingModel);
  } catch (err) {
    next(err);
  }
});

// Keyla Paguaga Jarquin 
// DELETE /api/models/:id
// This route performs a soft delete rather than permanently removing the record.
// Only the owner of the model or an admin user is allowed to delete it.
router.delete('/:id', async function(req, res, next) {
  try {
    var user = req.user;

    // Deleting a model requires the user to be authenticated.
    if (!user) {
      return res.status(401).json({
        status: 401,
        error: 'Authentication required'
      });
    }

    var id = req.params.id;

    // Validate the format of the id before querying the database.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid id'
      });
    }

    // Retrieve the model record to check whether it exists.
    var existingModel = await Model.findById(id).exec();

    // Return a not found response if the record does not exist or has already been deleted.
    if (!existingModel || existingModel.deleted) {
      return res.status(404).json({
        status: 404,
        error: 'Model not found'
      });
    }

    // Check whether the current user owns the record.
    var isOwner = existingModel.createdBy && String(existingModel.createdBy) === String(user._id);
    var canDelete = user.role === 'admin' || isOwner;

    // Only the owner or an admin is allowed to perform the delete action.
    if (!canDelete) {
      return res.status(403).json({
        status: 403,
        error: 'Forbidden: insufficient permissions to delete'
      });
    }

    // Mark the record as deleted and store audit information instead of removing it permanently.
    existingModel.deleted = true;
    existingModel.deletedAt = new Date();
    existingModel.deletedBy = user._id;

    await existingModel.save();

    // Return a success response showing that the model was deleted.
    res.json({
      message: 'Model deleted',
      id: existingModel._id
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router; // Export the router so these model routes can be used in the main application