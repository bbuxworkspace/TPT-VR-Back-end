// routes/authRoutes.js
const express = require('express');
const { login, register,logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this is in place

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/logout', authMiddleware, logout);

module.exports = router;
