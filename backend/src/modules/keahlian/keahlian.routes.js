const express = require('express');
const {
  getAllKeahlian,
  createKeahlian,
  updateKeahlian,
  deleteKeahlian
} = require('./keahlian.controller');
const { authMiddleware, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Public route for fetching (Needed in Registration Form before login)
router.get('/', getAllKeahlian);

// Protected routes (Only Admins can modify Master Data for Keahlian)
// If Operator needs to modify, we can change to `restrictTo('admin', 'operator')`
router.use(authMiddleware);
router.use(restrictTo('admin'));

router.post('/', createKeahlian);
router.route('/:id')
  .put(updateKeahlian)
  .delete(deleteKeahlian);

module.exports = router;
