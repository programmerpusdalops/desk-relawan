const express = require('express');
const morgan = require('morgan');
const { port, nodeEnv } = require('./config/env');
const { setupHelmet, setupCors, limiter } = require('./middlewares/security.middleware');
const globalErrorHandler = require('./middlewares/error.middleware');
const routes = require('./routes');
const prisma = require('./database/prisma');

const app = express();

// 1. GLOBAL MIDDLEWARES
app.use(setupHelmet);
app.use(setupCors);
app.use(express.json({ limit: '10mb' })); // JSON body parser
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all requests
app.use(limiter);

// Request Logging (Development mode)
if (nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 2. MOUNT ROUTES
// Base URL for API
app.use('/api/v1', routes);

// Fallback for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// 3. GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

// 4. START SERVER & CONNECT DATABASE
const startServer = async () => {
  try {
    // Attempt Database Connection
    await prisma.$connect();
    console.log('✅ PostgreSQL Database connected successfully.');
  } catch (error) {
    console.error('⚠️ Database connection failed. Running without DB for now.', error.message);
  }

  // Start Express App
  app.listen(port, () => {
    console.log(`🚀 Server running in ${nodeEnv} mode on port ${port}`);
  });
};

startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});
