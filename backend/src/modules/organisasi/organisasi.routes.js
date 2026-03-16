const express = require('express');
const {
  getAllOrganisasi,
  createOrganisasi,
  verifyOrganisasi,
  updateOrganisasi,
  deleteOrganisasi
} = require('./organisasi.controller');
const { authMiddleware, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Public route for fetching (Needed in Registration Form dropdowns)
router.get('/', getAllOrganisasi);

// Protected routes
router.use(authMiddleware);

// Any authenticated user can register an organization, but they start as pending
router.post('/', createOrganisasi);

// Only admins and operators can verify or reject an organization
router.patch('/:id/verify', restrictTo('admin', 'operator', 'pimpinan'), verifyOrganisasi);

// Only admins and operators can update
router.put('/:id', restrictTo('admin', 'operator', 'pimpinan'), updateOrganisasi);

// Only admins can delete entirely
router.delete('/:id', restrictTo('admin'), deleteOrganisasi);

module.exports = router;
