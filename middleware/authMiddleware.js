const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ status: 401, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ status: 401, message: 'User not found' });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    res.status(401).json({ status: 401, message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
