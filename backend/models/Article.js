const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },

    content: {
      type: String,
      required: [true, 'Article content is required'],
      trim: true,
    },

    category: {
      type: String,
      required: [true, 'Article category is required'],
      trim: true,
      enum: [
        'Science',
        'Technology',
        'Environment',
        'Health',
        'History',
        'Business',
        'Education',
        'Other',
      ],
    },

    tags: {
      type: [String],
      default: [],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    status: {
      type: String,
      enum: [
        'draft',
        'pending',
        'approved',
        'published',
        'rejected',
        'changes_requested',
      ],
      default: 'draft',
    },

    adminNote: {
      message: {
        type: String,
        default: '',
        trim: true,
      },

      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },

      reviewedAt: {
        type: Date,
        default: null,
      },
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Article', articleSchema);