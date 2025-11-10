const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Try multiple sources for JWT_SECRET
    const secret = process.env.JWT_SECRET || global.JWT_SECRET;
    
    if (!secret) {
      console.error('JWT_SECRET is not set in environment variables');
      console.error('Process.env.JWT_SECRET:', !!process.env.JWT_SECRET);
      console.error('Global.JWT_SECRET:', !!global.JWT_SECRET);
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

const requireOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const resourceOwnerId = req.params.userId || req.body.owner_id || req.query.owner_id;
  
  if (req.user.role === 'admin' || req.user.id.toString() === resourceOwnerId?.toString()) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOwnerOrAdmin
};
