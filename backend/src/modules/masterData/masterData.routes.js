const express = require('express');
const {
  getAllMasterData,
  createMasterData,
  updateMasterData,
  deleteMasterData
} = require('./masterData.controller');
const { authMiddleware, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// Terbuka baca untuk semua role loggin
router.get('/', getAllMasterData);

// Set operasi tulis untuk Operator ke atas
router.post('/', restrictTo('admin', 'operator', 'pimpinan'), createMasterData);
router.put('/:id', restrictTo('admin', 'operator', 'pimpinan'), updateMasterData);

// Delete eksklusif untuk Admin
router.delete('/:id', restrictTo('admin'), deleteMasterData);

module.exports = router;
