const express = require('express');
const { getVRData } = require('../controllers/vrController');
const router = express.Router();

router.get('/', getVRData);

module.exports = router;
