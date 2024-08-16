// controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = await User.findOne({ username });

  // If the user is not found, return an error
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
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

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
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
