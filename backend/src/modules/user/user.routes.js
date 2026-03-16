const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserStatus,
  updateUser,
  deleteUser
} = require('./user.controller');
const { authMiddleware, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Apply auth details broadly to this specific sub-module for the Pengguna page APIs
router.use(authMiddleware);
router.use(restrictTo('admin')); // RBAC: Only admin has sweeping rights here

// Base routes mapping
router.route('/')
  .get(getAllUsers)
  .post(createUser);

// Dynamic routes
router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Explicit toggle route
router.patch('/:id/status', updateUserStatus);

module.exports = router;
