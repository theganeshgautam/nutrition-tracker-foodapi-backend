const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user.role = user.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

module.exports = { authenticate, authorize };
