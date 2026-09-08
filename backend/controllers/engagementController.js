const mongoose = require('mongoose');
const Bookmark = require('../models/Bookmark');
const ReadingHistory = require('../models/ReadingHistory');
const ArticleEngagement = require('../models/ArticleEngagement');

const isDBConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// Memory fallback keeps the feature usable while the shared Atlas database is offline.
const memory = {
  bookmarks: [],
  history: [],
  articles: new Map(),
};

const getUserId = (req) => String(req.user?.id || req.user?._id || '');

const cleanMeta = (body = {}) => ({
  title: String(body.title || body.articleTitle || 'Untitled Article').trim(),
  excerpt: String(body.excerpt || body.articleExcerpt || '').trim(),
  category: String(body.category || body.articleCategory || 'General').trim(),
  authorName: String(body.authorName || '').trim(),
});

const upsertArticleEngagement = async (articleId, meta = {}) => {
  const data = cleanMeta(meta);

  if (isDBConnected()) {
    let article = await ArticleEngagement.findOne({ articleId });
    if (!article) article = await ArticleEngagement.create({ articleId, ...data });
    else {
      if (data.title !== 'Untitled Article') article.title = data.title;
      if (data.excerpt) article.excerpt = data.excerpt;
      if (data.category) article.category = data.category;
      if (data.authorName) article.authorName = data.authorName;
      await article.save();
    }
    return article;
  }

  const existing = memory.articles.get(articleId);
  const article = { ...(existing || { articleId, bookmarkCount: 0, readCount: 0 }), ...data };
  memory.articles.set(articleId, article);
  return article;
};

const adjustEngagement = async (articleId, field, delta, meta = {}) => {
  const article = await upsertArticleEngagement(articleId, meta);

  if (isDBConnected()) {
    article[field] = Math.max(0, (article[field] || 0) + delta);
    article.lastEngagedAt = new Date();
    await article.save();
    return article;
  }

  article[field] = Math.max(0, (article[field] || 0) + delta);
  article.lastEngagedAt = new Date();
  return article;
};

exports.bookmarkArticle = async (req, res) => {
  try {
    const userId = getUserId(req);
    const articleId = String(req.params.articleId || '').trim();
    if (!articleId) return res.status(400).json({ success: false, message: 'Article ID is required.' });

    const meta = cleanMeta(req.body);

    if (isDBConnected()) {
      const existing = await Bookmark.findOne({ userId, articleId });
      if (existing) {
        return res.json({ success: true, bookmarked: true, message: 'Article is already bookmarked.' });
      }
      const bookmark = await Bookmark.create({ userId, articleId, ...meta });
      await adjustEngagement(articleId, 'bookmarkCount', 1, meta);
      return res.status(201).json({ success: true, bookmarked: true, bookmark });
    }

    const existing = memory.bookmarks.find((b) => b.userId === userId && b.articleId === articleId);
    if (existing) return res.json({ success: true, bookmarked: true, message: 'Article is already bookmarked.' });
    memory.bookmarks.push({ userId, articleId, ...meta, createdAt: new Date() });
    await adjustEngagement(articleId, 'bookmarkCount', 1, meta);
    return res.status(201).json({ success: true, bookmarked: true });
  } catch (error) {
    if (error.code === 11000) return res.json({ success: true, bookmarked: true });
    res.status(500).json({ success: false, message: 'Unable to bookmark article.', error: error.message });
  }
};

exports.unbookmarkArticle = async (req, res) => {
  try {
    const userId = getUserId(req);
    const articleId = String(req.params.articleId || '').trim();
    let removed = false;

    if (isDBConnected()) {
      const result = await Bookmark.deleteOne({ userId, articleId });
      removed = result.deletedCount > 0;
    } else {
      const index = memory.bookmarks.findIndex((b) => b.userId === userId && b.articleId === articleId);
      if (index !== -1) {
        memory.bookmarks.splice(index, 1);
        removed = true;
      }
    }

    if (removed) await adjustEngagement(articleId, 'bookmarkCount', -1);
    res.json({ success: true, bookmarked: false, removed });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to remove bookmark.', error: error.message });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const userId = getUserId(req);
    const bookmarks = isDBConnected()
      ? await Bookmark.find({ userId }).sort({ createdAt: -1 }).lean()
      : memory.bookmarks.filter((b) => b.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load bookmarks.', error: error.message });
  }
};

exports.getBookmarkStatus = async (req, res) => {
  try {
    const userId = getUserId(req);
    const articleId = String(req.params.articleId || '').trim();
    const bookmarked = isDBConnected()
      ? !!(await Bookmark.exists({ userId, articleId }))
      : memory.bookmarks.some((b) => b.userId === userId && b.articleId === articleId);
    res.json({ success: true, bookmarked });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to check bookmark status.' });
  }
};

exports.recordRead = async (req, res) => {
  try {
    const userId = getUserId(req);
    const articleId = String(req.params.articleId || '').trim();
    if (!articleId) return res.status(400).json({ success: false, message: 'Article ID is required.' });
    const meta = cleanMeta(req.body);

    if (isDBConnected()) {
      const history = await ReadingHistory.findOneAndUpdate(
        { userId, articleId },
        { $set: { ...meta, lastReadAt: new Date() }, $inc: { readCount: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      await adjustEngagement(articleId, 'readCount', 1, meta);
      return res.json({ success: true, history });
    }

    const existing = memory.history.find((h) => h.userId === userId && h.articleId === articleId);
    if (existing) {
      Object.assign(existing, meta, { lastReadAt: new Date(), readCount: existing.readCount + 1 });
    } else {
      memory.history.push({ userId, articleId, ...meta, readCount: 1, lastReadAt: new Date() });
    }
    await adjustEngagement(articleId, 'readCount', 1, meta);
    res.json({ success: true, history: existing || memory.history[memory.history.length - 1] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to record reading history.', error: error.message });
  }
};

exports.getReadingHistory = async (req, res) => {
  try {
    const userId = getUserId(req);
    const history = isDBConnected()
      ? await ReadingHistory.find({ userId }).sort({ lastReadAt: -1 }).lean()
      : memory.history.filter((h) => h.userId === userId).sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt));
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load reading history.', error: error.message });
  }
};

exports.clearReadingHistory = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (isDBConnected()) await ReadingHistory.deleteMany({ userId });
    else memory.history = memory.history.filter((h) => h.userId !== userId);
    res.json({ success: true, message: 'Reading history cleared.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to clear reading history.', error: error.message });
  }
};

exports.getTrendingArticles = async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 20);
    let articles;

    if (isDBConnected()) {
      articles = await ArticleEngagement.find({ $or: [{ readCount: { $gt: 0 } }, { bookmarkCount: { $gt: 0 } }] })
        .sort({ bookmarkCount: -1, readCount: -1, lastEngagedAt: -1 })
        .limit(limit)
        .lean();
    } else {
      articles = [...memory.articles.values()]
        .filter((a) => a.readCount > 0 || a.bookmarkCount > 0)
        .sort((a, b) => {
          const scoreA = a.readCount + a.bookmarkCount * 3;
          const scoreB = b.readCount + b.bookmarkCount * 3;
          return scoreB - scoreA;
        })
        .slice(0, limit);
    }

    const result = articles.map((article) => ({
      ...article,
      engagementScore: (article.readCount || 0) + (article.bookmarkCount || 0) * 3,
    }));
    res.json({ success: true, articles: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load trending articles.', error: error.message });
  }
};
