// routes/testRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this is in place

const router = express.Router();

router.get('/', (req, res) => {

    res.status(200).json({
      status: 'API version 1.0',
      message: 'Hello, welcome to the TPT VR System API!',
      timestamp: new Date().toISOString(),
    });
  
  });
  
// Define a protected route
router.get('/some-protected-route', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'This is a protected route' });
});

module.exports = router;