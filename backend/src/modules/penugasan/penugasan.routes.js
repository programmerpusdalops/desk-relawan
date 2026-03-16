const express = require('express');
const {
  getAllPenugasan,
  createPenugasan,
  updatePenugasan,
  deletePenugasan,
  downloadSuratTugas
} = require('./penugasan.controller');
const { authMiddleware, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// Fetching Data
router.get('/', getAllPenugasan);

// Management (Admin, Operator, Pimpinan)
router.post('/', restrictTo('admin', 'operator', 'pimpinan'), createPenugasan);
router.put('/:id', restrictTo('admin', 'operator', 'pimpinan'), updatePenugasan);

// PDF Document Generation
router.get('/:id/surat-tugas', downloadSuratTugas);

// Deletion (Admin Only)
router.delete('/:id', restrictTo('admin'), deletePenugasan);

module.exports = router;
