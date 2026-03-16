const express = require('express');
const { getAllLaporan, createLaporan, deleteLaporan } = require('./laporan.controller');
const { authMiddleware, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// Semua role yg login boleh lihat laporan
router.get('/', getAllLaporan);

// Relawan membuat laporan untuk penugasannya (Admin/Operator bisa submit by proxy jika mau logic dibebaskan)
router.post('/', createLaporan);

// Hanya Admin yg boleh membuang history laporan
router.delete('/:id', restrictTo('admin'), deleteLaporan);

module.exports = router;
