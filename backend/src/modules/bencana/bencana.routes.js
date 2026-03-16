const express = require('express');
const {
  getAllBencana,
  getBencanaById,
  createBencana,
  updateBencana,
  deleteBencana
} = require('./bencana.controller');
const { authMiddleware, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

// All operational module endpoints inherently require authentication
router.use(authMiddleware);

// Fetching Data 
router.get('/', getAllBencana);
router.get('/:id', getBencanaById);

// Creation and Management (Admin, Operator, Pimpinan)
router.post('/', restrictTo('admin', 'operator', 'pimpinan'), createBencana);
router.put('/:id', restrictTo('admin', 'operator', 'pimpinan'), updateBencana);

// Deletions (Admin Only to prevent accidental data purging cascaded ops)
router.delete('/:id', restrictTo('admin'), deleteBencana);

module.exports = router;
