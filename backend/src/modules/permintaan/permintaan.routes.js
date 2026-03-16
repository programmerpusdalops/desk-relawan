const express = require('express');
const {
  getAllPermintaan,
  createPermintaan,
  updatePermintaan,
  deletePermintaan
} = require('./permintaan.controller');
const { authMiddleware, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// Fetching requests
router.get('/', getAllPermintaan);

// Management (Admin, Operator, Pimpinan)
router.post('/', restrictTo('admin', 'operator', 'pimpinan'), createPermintaan);
router.put('/:id', restrictTo('admin', 'operator', 'pimpinan'), updatePermintaan);

// Deletion (Admin Only)
router.delete('/:id', restrictTo('admin'), deletePermintaan);

module.exports = router;
