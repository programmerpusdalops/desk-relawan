require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  nodeEnv: process.env.NODE_ENV || 'development',
};
