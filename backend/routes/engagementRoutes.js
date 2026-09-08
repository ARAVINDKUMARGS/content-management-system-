const express = require('express');
const {
  bookmarkArticle,
  unbookmarkArticle,
  getBookmarks,
  getBookmarkStatus,
  recordRead,
  getReadingHistory,
  clearReadingHistory,
  getTrendingArticles,
} = require('../controllers/engagementController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.get('/trending', getTrendingArticles);

router.use(authenticateUser);

router.post('/bookmarks/:articleId', bookmarkArticle);
router.delete('/bookmarks/:articleId', unbookmarkArticle);
router.get('/bookmarks', getBookmarks);
router.get('/bookmarks/:articleId/status', getBookmarkStatus);

router.post('/history/:articleId', recordRead);
router.get('/history', getReadingHistory);
router.delete('/history', clearReadingHistory);

module.exports = router;
