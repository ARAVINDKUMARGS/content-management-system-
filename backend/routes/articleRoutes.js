const express = require('express');

const router = express.Router();

const {
  getArticles,
  getArticleById,
  getMyArticles,
  getMyArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  submitArticle,
  reviewArticle,
} = require('../controllers/articleController');

const {
  authenticateUser,
  authorizeRole,
} = require('../middleware/auth');

/*
 * ============================================================
 * PUBLIC ARTICLE ROUTES
 * ============================================================
 */

/*
 * Get all published articles
 * GET /api/articles
 */
router.get('/', getArticles);

/*
 * Get a single published article
 * GET /api/articles/:id
 *
 * IMPORTANT:
 * Keep this route AFTER /my routes.
 */


/*
 * ============================================================
 * AUTHOR ROUTES
 * ============================================================
 */

/*
 * Get logged-in author's articles
 * GET /api/articles/my
 */
router.get(
  '/my',
  authenticateUser,
  authorizeRole('author'),
  getMyArticles
);

/*
 * Get logged-in author's specific article
 * GET /api/articles/my/:id
 *
 * Used when opening the Edit Article page.
 */
router.get(
  '/my/:id',
  authenticateUser,
  authorizeRole('author'),
  getMyArticleById
);

/*
 * Create a new article/draft
 * POST /api/articles
 */
router.post(
  '/',
  authenticateUser,
  authorizeRole('author'),
  createArticle
);

/*
 * Update an existing article
 * PUT /api/articles/:id
 */
router.put(
  '/:id',
  authenticateUser,
  authorizeRole('author'),
  updateArticle
);

/*
 * Delete an article
 * DELETE /api/articles/:id
 */
router.delete(
  '/:id',
  authenticateUser,
  authorizeRole('author'),
  deleteArticle
);

/*
 * Submit article for admin review
 * PATCH /api/articles/:id/submit
 */
router.patch(
  '/:id/submit',
  authenticateUser,
  authorizeRole('author'),
  submitArticle
);


/*
 * ============================================================
 * ADMIN ROUTES
 * ============================================================
 */

/*
 * Review article
 *
 * PATCH /api/articles/:id/review
 *
 * Body:
 * {
 *   "status": "published",
 *   "reviewFeedback": ""
 * }
 *
 * OR:
 *
 * {
 *   "status": "changes_requested",
 *   "reviewFeedback": "Please add more sources."
 * }
 */
router.patch(
  '/:id/review',
  authenticateUser,
  authorizeRole('admin'),
  reviewArticle
);


/*
 * Get a single published article
 * GET /api/articles/:id
 *
 * This MUST be after /my and /my/:id.
 */
router.get('/:id', getArticleById);

module.exports = router;