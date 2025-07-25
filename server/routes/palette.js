const express = require('express');
const router = express.Router();
const paletteController = require('../controllers/paletteController');

// Save a palette
router.post('/save', paletteController.savePalette);
// Get palettes by user
router.get('/user/:userId', paletteController.getUserPalettes);
// Get all public palettes
router.get('/public', paletteController.getPublicPalettes);
// Get palette by ID (shareable link)
router.get('/:paletteId', paletteController.getPaletteById);
// Add comment to palette (optional)
router.post('/:paletteId/comment', paletteController.addComment);

module.exports = router;
