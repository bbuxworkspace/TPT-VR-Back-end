const express = require('express');
const router = express.Router();
const tileController = require('../controllers/tileController');

router.get('/tiles', tileController.getTiles);
router.post('/tiles/favorite', tileController.favoriteTile);

module.exports = router;