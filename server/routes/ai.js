const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Get AI-powered palette suggestions
router.post('/suggestions', aiController.getSuggestions);

// Get AI-powered animation CSS
router.post('/animation', aiController.getAnimationCSS);

module.exports = router;