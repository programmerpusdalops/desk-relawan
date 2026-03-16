const express = require('express');
const { getLokasiRelawan, pingLokasi, overrideLokasi } = require('./monitoring.controller');
const { authMiddleware, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// Admin / Operator can fetch all monitoring active points
router.get('/lokasi', restrictTo('admin', 'operator', 'pimpinan'), getLokasiRelawan);

// Admin / Operator Manual Override
router.put('/:id/override', restrictTo('admin', 'operator', 'pimpinan'), overrideLokasi);

// Volunteers post their own locations to the ping route
router.post('/update-location', pingLokasi);

module.exports = router;
