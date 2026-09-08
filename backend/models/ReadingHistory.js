const mongoose = require('mongoose');

const readingHistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    articleId: { type: String, required: true, index: true },
    articleTitle: { type: String, default: '' },
    articleExcerpt: { type: String, default: '' },
    articleCategory: { type: String, default: '' },
    authorName: { type: String, default: '' },
    readCount: { type: Number, default: 1 },
    lastReadAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

readingHistorySchema.index({ userId: 1, articleId: 1 }, { unique: true });
readingHistorySchema.index({ articleId: 1, lastReadAt: -1 });

module.exports = mongoose.model('ReadingHistory', readingHistorySchema);
