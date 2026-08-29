const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
      maxlength: [200, 'Article title cannot exceed 200 characters'],
    },

    category: {
      type: String,
      required: [true, 'Article category is required'],
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    content: {
      type: String,
      required: [true, 'Article content is required'],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Article author is required'],
    },

    status: {
      type: String,
      enum: [
        'draft',
        'pending_review',
        'changes_requested',
        'published',
        'rejected',
      ],
      default: 'draft',
    },

    reviewFeedback: {
      type: String,
      default: '',
      trim: true,
    },

    quiz: {
      enabled: {
        type: Boolean,
        default: false,
      },

      question: {
        type: String,
        default: '',
        trim: true,
      },

      options: {
        type: [String],
        default: [],
      },

      correctAnswer: {
        type: String,
        default: '',
        trim: true,
      },
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    likes: {
      type: Number,
      default: 0,
      min: 0,
    },

    readingTime: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Calculate approximate reading time.
 * Average reading speed = 200 words per minute.
 */
articleSchema.pre('save', function (next) {
  if (this.content) {
    const wordCount = this.content
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  next();
});

/*
 * Calculate reading time whenever an article is updated.
 */
articleSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  if (update.content) {
    const wordCount = update.content
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    update.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;