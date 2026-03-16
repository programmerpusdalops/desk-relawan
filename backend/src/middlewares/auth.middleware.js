const { verifyToken } = require('../utils/jwt');
const prisma = require('../database/prisma');

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    
    // Check if Authorization header has Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'Not authorized to access this route. No token provided.' });
    }
    
    // Verify Token
    const decoded = verifyToken(token);
    
    // Find User
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { relawanProfile: true }
    });
    
    if (!currentUser) {
      return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer exists.' });
    }
    
    // Check Status (optional but good practice)
    if (currentUser.status === 'inactive') {
      return res.status(403).json({ status: 'fail', message: 'Your account is currently inactive. Please contact your admin for verification.' });
    }
    
    // Attach user to Request Object
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ status: 'fail', message: 'Invalid Token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ status: 'fail', message: 'Your token has expired! Please log in again.' });
    }
    next(error);
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to perform this action.' });
    }
    next();
  };
};

module.exports = { authMiddleware, restrictTo };
