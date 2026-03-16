const express = require('express');
const { 
  register, 
  getAllRelawan, 
  getRelawanById, 
  verifyRelawan, 
  updateRelawan, 
  deleteRelawan 
} = require('./relawan.controller');
const { authMiddleware, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Public route -> POST /api/v1/relawan/register
router.post('/register', register);

// Protected routes
router.use(authMiddleware);

// Fetching Data (Admin, Operator, Pimpinan)
router.get('/', restrictTo('admin', 'operator', 'pimpinan'), getAllRelawan);
router.get('/:id', getRelawanById);

// Update details
router.put('/:id', restrictTo('admin', 'operator', 'pimpinan'), updateRelawan);

// Validations and Access toggling
router.patch('/:id/verify', restrictTo('admin', 'operator', 'pimpinan'), verifyRelawan);

// Deletions
router.delete('/:id', restrictTo('admin'), deleteRelawan);

module.exports = router;
