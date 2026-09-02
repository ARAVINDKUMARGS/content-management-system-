const express = require('express');

const {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  submitArticle,
  approveArticle,
  rejectArticle,
  requestChanges,
  publishArticle,
  getMyArticles,
} = require('../controllers/articleController');

const {
  authenticateUser,
  authorizeRole,
} = require('../middleware/auth');

const router = express.Router();

// Get logged-in author's articles
router.get('/mine', authenticateUser, getMyArticles);

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

// Get all articles
router.get('/', authenticateUser, getArticles);

// Get single article
router.get('/:id', authenticateUser, getArticleById);

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
  requestChanges
);

// Admin: publish article
router.patch(
  '/:id/publish',
  authenticateUser,
  authorizeRole('admin'),
  publishArticle
);

module.exports = router;