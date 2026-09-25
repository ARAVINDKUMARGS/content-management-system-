const mongoose = require('mongoose');
const Appeal = require('../models/Appeal');
const Report = require('../models/Report');

const isMongoConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

// Create a new appeal
const createAppeal = async (req, res) => {
  try {
    const { reportId, reason, details } = req.body;

    if (!reportId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Report ID and appeal reason are required.',
      });
    }

    if (!isMongoConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID.',
      });
    }

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    const appellantId = req.user?._id || req.user?.id || null;
    const appellantName = req.user?.name || 'Anonymous User';

    const appeal = await Appeal.create({
      reportId,
      appellantId,
      appellantName,
      reason,
      details: details || '',
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Appeal submitted successfully.',
      appeal,
    });
  } catch (error) {
    console.error('Create appeal error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to submit appeal.',
    });
  }
};

// Get appeals for the logged-in user
const getMyAppeals = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected.',
      });
    }

    const userId = req.user?._id || req.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID.',
      });
    }

    const appeals = await Appeal.find({
      appellantId: userId,
    })
      .sort({ createdAt: -1 })
      .populate('reportId')
      .populate('reviewedBy', 'name email');

    return res.status(200).json({
      success: true,
      count: appeals.length,
      appeals,
    });
  } catch (error) {
    console.error('Get my appeals error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch appeals.',
    });
  }
};

// Admin gets all appeals
const getAppeals = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected.',
      });
    }

    const { status } = req.query;

    const filter = {};

    if (
      status &&
      ['pending', 'approved', 'rejected'].includes(status)
    ) {
      filter.status = status;
    }

    const appeals = await Appeal.find(filter)
      .sort({ createdAt: -1 })
      .populate('reportId')
      .populate('appellantId', 'name email')
      .populate('reviewedBy', 'name email');

    return res.status(200).json({
      success: true,
      count: appeals.length,
      appeals,
    });
  } catch (error) {
    console.error('Get appeals error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch appeals.',
    });
  }
};

// Admin reviews an appeal
const reviewAppeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Appeal status must be approved or rejected.',
      });
    }

    if (!isMongoConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appeal ID.',
      });
    }

    const reviewerId = req.user?._id || req.user?.id || null;

    const appeal = await Appeal.findByIdAndUpdate(
      id,
      {
        status,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        reviewNotes: reviewNotes || '',
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('reportId')
      .populate('appellantId', 'name email')
      .populate('reviewedBy', 'name email');

    if (!appeal) {
      return res.status(404).json({
        success: false,
        message: 'Appeal not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Appeal ${status} successfully.`,
      appeal,
    });
  } catch (error) {
    console.error('Review appeal error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to review appeal.',
    });
  }
};

module.exports = {
  createAppeal,
  getMyAppeals,
  getAppeals,
  reviewAppeal,
};