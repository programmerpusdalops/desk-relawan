const express = require('express');
const dashboardController = require('./dashboard.controller');
const { authMiddleware, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Allow all authenticated roles to view Dashboard stats
// Since this is just analytical data, no destructive ops
router.use(authMiddleware, restrictTo('admin', 'operator', 'relawan', 'pimpinan'));

router.get('/stats', dashboardController.getStats);
router.get('/chart-skills', dashboardController.getSkillDistribution);
router.get('/chart-activity', dashboardController.getActivityChart);

module.exports = router;
