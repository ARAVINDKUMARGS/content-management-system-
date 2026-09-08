const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    articleId: { type: String, required: true, index: true },
    articleTitle: { type: String, default: '' },
    articleExcerpt: { type: String, default: '' },
    articleCategory: { type: String, default: '' },
    authorName: { type: String, default: '' },
  },
  { timestamps: true }
);

bookmarkSchema.index({ userId: 1, articleId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
