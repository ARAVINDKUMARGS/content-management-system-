const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  getQuizByArticleId,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
} = require('../controllers/quizController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// Public / Authenticated read routes
router.get('/', getAllQuizzes);
router.get('/article/:articleId', getQuizByArticleId);
router.get('/:id', getQuizById);

// Author & Admin creation / update routes
router.post('/', authenticateUser, authorizeRole('author', 'admin'), createQuiz);
router.put('/:id', authenticateUser, authorizeRole('author', 'admin'), updateQuiz);
router.patch('/:id/submit', authenticateUser, authorizeRole('author', 'admin'), submitQuiz);
router.delete('/:id', authenticateUser, authorizeRole('author', 'admin'), deleteQuiz);

module.exports = router;
