const express = require('express');
const {
  getAllLogistik,
  createLogistik,
  updateLogistik,
  deleteLogistik
} = require('./logistik.controller');
const { authMiddleware, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// Open viewing for authenticated users
router.get('/', getAllLogistik);

// Restricted item modification handlers
router.post('/', restrictTo('admin', 'operator', 'pimpinan'), createLogistik);
router.put('/:id', restrictTo('admin', 'operator', 'pimpinan'), updateLogistik);

// Danger bounds
router.delete('/:id', restrictTo('admin'), deleteLogistik);

module.exports = router;
