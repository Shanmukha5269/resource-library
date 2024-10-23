const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Article, Book
  description: { type: String },
  link: { type: String },
});

module.exports = mongoose.model('Resource', resourceSchema);
