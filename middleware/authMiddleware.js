const jwt = require('jsonwebtoken');
const { Employer } = require('../models');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find user from the token's ID and attach to request object
      req.user = await Employer.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      
      next(); // Move to the next middleware/route handler
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ✅ ADD THIS ENTIRE FUNCTION
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if the logged-in user's role is included in the roles allowed for this route
    // Note: Since we only have employers, this will check for 'employer'
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next(); // If they have permission, move on
  };
};

// ✅ MAKE SURE YOU EXPORT BOTH FUNCTIONS
module.exports = { protect, restrictTo };