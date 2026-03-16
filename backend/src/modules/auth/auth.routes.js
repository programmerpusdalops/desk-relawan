const express = require('express');
const { login, getMe, updatePassword } = require('./auth.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Public route -> POST /api/v1/auth/login
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getMe);
router.put('/password', authMiddleware, updatePassword);

module.exports = router;
