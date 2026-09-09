const mongoose = require('mongoose');
const Report = require('../models/Report');

const initialReports = [
  {
    _id: 'report-1',
    id: 1,
    type: 'Article',
    item: 'The Psychology of Success',
    reportedBy: 'Priya Sharma',
    reason: 'Misleading information',
    description: 'Some of the claims in this article appear to be misleading and should be reviewed.',
    date: 'Sep 05, 2026',
    status: 'pending',
  },
  {
    _id: 'report-2',
    id: 2,
    type: 'Comment',
    item: 'Comment by Rohan Patil',
    reportedBy: 'Aarav Mehta',
    reason: 'Inappropriate content',
    description: 'The comment contains language that may violate the platform community guidelines.',
    date: 'Sep 04, 2026',
    status: 'pending',
  },
  {
    _id: 'report-3',
    id: 3,
    type: 'Article',
    item: 'Understanding Human Behavior',
    reportedBy: 'Neha Joshi',
    reason: 'Incorrect information',
    description: 'The reported article contains information that the user believes is factually incorrect.',
    date: 'Sep 03, 2026',
    status: 'resolved',
  },
  {
    _id: 'report-4',
    id: 4,
    type: 'Comment',
    item: 'Comment by Vikram Singh',
    reportedBy: 'Priya Sharma',
    reason: 'Spam',
    description: 'The reported comment appears to contain repetitive promotional content.',
    date: 'Sep 02, 2026',
    status: 'dismissed',
  },
  {
    _id: 'report-5',
    id: 5,
    type: 'Article',
    item: 'Technology and Society',
    reportedBy: 'Rohan Patil',
    reason: 'Copyright concern',
    description: 'The user has reported that some content may have been used without proper attribution.',
    date: 'Sep 01, 2026',
    status: 'pending',
  },
];

let inMemoryReports = [...initialReports];

const isMongoConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

// GET /api/reports
const getReports = async (req, res) => {
  try {
    const { status, type } = req.query;

    if (isMongoConnected()) {
      const filter = {};
      if (status && status !== 'all') filter.status = status;
      if (type && type !== 'all') filter.type = type;

      let reports = await Report.find(filter).sort({ createdAt: -1 });

      if (reports.length === 0 && !status && !type) {
        // Seed initial reports if DB collection is empty
        await Report.insertMany(
          initialReports.map((r) => ({
            type: r.type,
            item: r.item,
            reportedBy: r.reportedBy,
            reason: r.reason,
            description: r.description,
            status: r.status,
          }))
        );
        reports = await Report.find().sort({ createdAt: -1 });
      }

      if (reports.length > 0) {
        return res.status(200).json({
          success: true,
          count: reports.length,
          reports,
        });
      }
    }

    let filtered = [...inMemoryReports];
    if (status && status !== 'all') {
      filtered = filtered.filter((r) => r.status === status);
    }
    if (type && type !== 'all') {
      filtered = filtered.filter((r) => r.type === type);
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      reports: filtered,
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(200).json({
      success: true,
      count: inMemoryReports.length,
      reports: inMemoryReports,
    });
  }
};

// POST /api/reports
const createReport = async (req, res) => {
  try {
    const { type, item, reason, description, targetId } = req.body;

    if (!item || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Item and reason are required.',
      });
    }

    const reporterName = req.user?.name || 'Anonymous User';
    const reporterId = req.user?._id || req.user?.id || null;

    if (isMongoConnected()) {
      const report = await Report.create({
        type: type || 'Article',
        item,
        targetId: targetId || '',
        reportedBy: reporterName,
        reporterId,
        reason,
        description: description || '',
        status: 'pending',
      });

      return res.status(201).json({
        success: true,
        message: 'Report submitted successfully.',
        report,
      });
    }

    const newReport = {
      _id: `report-${Date.now()}`,
      id: Date.now(),
      type: type || 'Article',
      item,
      targetId: targetId || '',
      reportedBy: reporterName,
      reason,
      description: description || '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'pending',
    };

    inMemoryReports.unshift(newReport);

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully.',
      report: newReport,
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit report.',
    });
  }
};

// PATCH /api/reports/:id/status or PUT /api/reports/:id
const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.',
      });
    }

    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const report = await Report.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (report) {
        return res.status(200).json({
          success: true,
          message: `Report status updated to ${status}.`,
          report,
        });
      }
    }

    const found = inMemoryReports.find((r) => r._id === id || r.id === Number(id) || r.id === id);
    if (found) {
      found.status = status;
      return res.status(200).json({
        success: true,
        message: `Report status updated to ${status}.`,
        report: found,
      });
    }

    res.status(404).json({
      success: false,
      message: 'Report not found.',
    });
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update report status.',
    });
  }
};

module.exports = {
  getReports,
  createReport,
  updateReportStatus,
};
