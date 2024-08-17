const express = require('express');
const { getSoftwareData } = require('../controllers/softwareController');
const router = express.Router();

router.get('/', getSoftwareData);

module.exports = router;
