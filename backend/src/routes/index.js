const express = require('express');

const router = express.Router();

// Root route
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Desk Relawan API!',
  });
});

// Import feature routes
const authRoutes = require('../modules/auth/auth.routes');
const relawanRoutes = require('../modules/relawan/relawan.routes');
const userRoutes = require('../modules/user/user.routes');
const keahlianRoutes = require('../modules/keahlian/keahlian.routes');
const organisasiRoutes = require('../modules/organisasi/organisasi.routes');
const bencanaRoutes = require('../modules/bencana/bencana.routes');
const permintaanRoutes = require('../modules/permintaan/permintaan.routes');
const penugasanRoutes = require('../modules/penugasan/penugasan.routes');
const monitoringRoutes = require('../modules/monitoring/monitoring.routes');
const laporanRoutes = require('../modules/laporan/laporan.routes');
const logistikRoutes = require('../modules/logistik/logistik.routes');
const masterDataRoutes = require('../modules/masterData/masterData.routes');
const dashboardRoutes = require('../modules/dashboard/dashboard.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/relawan', relawanRoutes);
router.use('/users', userRoutes);
router.use('/keahlian', keahlianRoutes);
router.use('/organisasi', organisasiRoutes);
router.use('/bencana', bencanaRoutes);
router.use('/permintaan-relawan', permintaanRoutes);
router.use('/penugasan', penugasanRoutes);
router.use('/monitoring', monitoringRoutes);
router.use('/laporan', laporanRoutes);
router.use('/logistik', logistikRoutes);
router.use('/master-data', masterDataRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
