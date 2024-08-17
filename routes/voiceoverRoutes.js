const express = require('express');
const { getVoiceoverData } = require('../controllers/voiceoverController');
const router = express.Router();

router.get('/', getVoiceoverData);

module.exports = router;
