const express = require('express');

const {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  submitArticle,
  getMyArticles,
  likeArticle,
  incrementViews,
  deleteArticle,
} = require('../controllers/articleController');

const {
  approveArticle,
  rejectArticle,
  requestArticleChanges,
} = require('../controllers/adminVerificationController');

const {
  authenticateUser,
  authorizeRole,
} = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getArticles);
router.patch('/:id/view', incrementViews);

// Logged-in author / user routes
router.get('/mine', authenticateUser, getMyArticles);
router.patch('/:id/like', authenticateUser, likeArticle);

// Article lookup (optional auth to populate user state)
router.get('/:id', getArticleById);

// Create article
router.post(
  '/',
  authenticateUser,
  authorizeRole('author', 'admin'),
  createArticle
);

// Submit article for review
router.patch(
  '/:id/submit',
  authenticateUser,
  authorizeRole('author', 'admin'),
  submitArticle
);

// Update article
router.put(
  '/:id',
  authenticateUser,
  authorizeRole('author', 'admin'),
  updateArticle
);

// Delete article
router.delete(
  '/:id',
  authenticateUser,
  authorizeRole('author', 'admin'),
  deleteArticle
);

// Admin: approve article
router.patch(
  '/:id/approve',
  authenticateUser,
  authorizeRole('admin'),
  approveArticle
);

// Admin: reject article
router.patch(
  '/:id/reject',
  authenticateUser,
  authorizeRole('admin'),
  rejectArticle
);

// Admin: request changes
router.patch(
  '/:id/request-changes',
  authenticateUser,
  authorizeRole('admin'),
  requestArticleChanges
);

module.exports = router;