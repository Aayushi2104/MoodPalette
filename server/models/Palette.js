const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const paletteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  colors: [String],
  mood: String,
  country: String,
  isPublic: { type: Boolean, default: false },
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Palette', paletteSchema);
