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

/*
 * Author / authenticated user routes
 */

// Get my articles
router.get(
  '/mine',
  authenticateUser,
  getMyArticles
);

// Create article
router.post(
  '/',
  authenticateUser,
  authorizeRole('author', 'admin'),
  createArticle
);

// Submit article
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

/*
 * General article routes
 */

// Get articles
router.get(
  '/',
  authenticateUser,
  getArticles
);

// Get article by ID
router.get(
  '/:id',
  authenticateUser,
  getArticleById
);

/*
 * Admin workflow
 */

// Approve
router.patch(
  '/:id/approve',
  authenticateUser,
  authorizeRole('admin'),
  approveArticle
);

// Reject
router.patch(
  '/:id/reject',
  authenticateUser,
  authorizeRole('admin'),
  rejectArticle
);

// Request changes
router.patch(
  '/:id/request-changes',
  authenticateUser,
  authorizeRole('admin'),
  requestChanges
);

// Publish
router.patch(
  '/:id/publish',
  authenticateUser,
  authorizeRole('admin'),
  publishArticle
);

module.exports = router;