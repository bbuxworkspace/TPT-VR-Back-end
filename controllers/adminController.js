// controllers/adminController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');


exports.createAdmin = async (req, res) => {
    const { username, password, role } = req.body;
  
    // Check if username, password, and role are provided
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Username, password, and role are required' });
    }

    // Check if role is 'admin'
    if (role !== 'admin') {
        return res.status(400).json({ message: 'Role must be "admin"' });
    }
  
    const userExists = await User.findOne({ username });
  
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    const user = await User.create({
      username,
      password,
      role
    });
  
    if (user) {
      return res.status(201).json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  };

// Admin Login
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = await User.findOne({ username, role: 'admin' });

  // If the user is not found or is not an admin, return an error
  if (!user) {
      return res.status(400).json({ message: 'Admin not found' });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (isMatch) {
      return res.json({
          _id: user._id,
          username: user.username,
          role: user.role,
          token: generateToken(user._id)  // Include token generation
      });
  } else {
      return res.status(401).json({ message: 'Invalid username or password' });
  }
};

// Admin Logout
exports.adminLogout = (req, res) => {
  // Invalidate token on the client side
  res.json({ message: 'Admin logged out successfully' });
};