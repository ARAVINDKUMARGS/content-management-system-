const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['Article', 'Comment', 'User', 'Other'],
      default: 'Article',
    },
    item: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      default: '',
    },
    reportedBy: {
      type: String,
      required: true,
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reason: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
