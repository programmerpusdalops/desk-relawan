const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

const generateToken = (payload, expiresIn = '24h') => {
  return jwt.sign(payload, jwtSecret, { expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

module.exports = {
  generateToken,
  verifyToken,
};
