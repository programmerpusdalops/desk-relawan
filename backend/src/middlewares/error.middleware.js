const { nodeEnv } = require('../config/env');

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(nodeEnv === 'development' && { stack: err.stack }), // Show stack trace only in dev
  });
};

module.exports = globalErrorHandler;
