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