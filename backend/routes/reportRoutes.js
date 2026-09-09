const express = require('express');
const router = express.Router();
const {
  getReports,
  createReport,
  updateReportStatus,
} = require('../controllers/reportController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// Public/Authenticated create report
router.post('/', createReport);

// Admin read & manage reports
router.get('/', authenticateUser, authorizeRole('admin'), getReports);
router.patch('/:id/status', authenticateUser, authorizeRole('admin'), updateReportStatus);
router.put('/:id', authenticateUser, authorizeRole('admin'), updateReportStatus);

module.exports = router;
