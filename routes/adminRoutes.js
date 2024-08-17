const express = require('express');
const {
  createAdmin,
  adminLogin,
  adminLogout
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this is in place
const router = express.Router();

router.post('/create-admin', createAdmin);  // Assuming only authenticated admins can create other admins
router.post('/login', adminLogin);
router.post('/logout', authMiddleware, adminLogout);

module.exports = router;