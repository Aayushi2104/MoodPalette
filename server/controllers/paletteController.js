const Palette = require('../models/Palette');

// Save a palette
exports.savePalette = async (req, res) => {
  try {
    const { userId, colors, mood, country, isPublic } = req.body;
    const palette = new Palette({ userId, colors, mood, country, isPublic });
    await palette.save();
    res.status(201).json(palette);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get palettes by user
exports.getUserPalettes = async (req, res) => {
  try {
    const palettes = await Palette.find({ userId: req.params.userId });
    res.json(palettes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all public palettes
exports.getPublicPalettes = async (req, res) => {
  try {
    const palettes = await Palette.find({ isPublic: true });
    res.json(palettes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get palette by ID (shareable link)
exports.getPaletteById = async (req, res) => {
  try {
    const palette = await Palette.findById(req.params.paletteId);
    if (!palette) return res.status(404).json({ error: 'Palette not found' });
    res.json(palette);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add comment to palette (optional)
exports.addComment = async (req, res) => {
  try {
    const { user, text } = req.body;
    const palette = await Palette.findById(req.params.paletteId);
    if (!palette) return res.status(404).json({ error: 'Palette not found' });
    palette.comments.push({ user, text });
    await palette.save();
    res.json(palette);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
