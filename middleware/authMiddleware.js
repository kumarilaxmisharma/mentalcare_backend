// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { Employer } = require('../models');

 // Make sure you import your Employer model

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the employer by the ID from the token
      //    We exclude the password from the result for security
      const currentEmployer = await Employer.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      // 4. THE FIX: Check if an employer was found
      if (!currentEmployer) {
        return res.status(401).json({ message: 'Not authorized, employer not found' });
      }

      // 5. Attach the employer object to the request
      req.employer = currentEmployer; // Attach to req.employer
      next();

    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const restrictTo = (role) => {
  return (req, res, next) => {
    if (!req.employer || req.employer.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = { protect, restrictTo };