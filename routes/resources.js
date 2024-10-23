const express = require('express');
const Resource = require('../models/Resource');

const router = express.Router();

// List resources
router.get('/', async (req, res) => {
  const resources = await Resource.find();
  res.render('resources', { resources });
});

// Add a new resource (for simplicity, no authentication here)
router.post('/', async (req, res) => {
  const resource = new Resource(req.body);
  await resource.save();
  res.redirect('/resources');
});

module.exports = router;
