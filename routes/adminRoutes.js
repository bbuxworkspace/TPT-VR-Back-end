// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route to create an admin user
router.post('/create-admin', adminController.createAdmin);

module.exports = router;
