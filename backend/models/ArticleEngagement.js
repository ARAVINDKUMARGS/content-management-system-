const mongoose = require('mongoose');

const articleEngagementSchema = new mongoose.Schema(
  {
    articleId: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: 'Untitled Article' },
    excerpt: { type: String, default: '' },
    category: { type: String, default: 'General' },
    authorName: { type: String, default: '' },
    bookmarkCount: { type: Number, default: 0 },
    readCount: { type: Number, default: 0 },
    lastEngagedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ArticleEngagement', articleEngagementSchema);
