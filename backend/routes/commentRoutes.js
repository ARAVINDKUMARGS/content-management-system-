const express = require('express');
const router = express.Router();
const {
  getCommentsByTarget,
  createComment,
  updateComment,
  deleteComment,
  toggleReaction,
  getRecentDiscussions,
} = require('../controllers/commentController');
const { authenticateUser, optionalAuth } = require('../middleware/auth');

// Public / Feed routes
router.get('/recent', optionalAuth, getRecentDiscussions);
router.get('/target/:targetId', optionalAuth, getCommentsByTarget);

// Authenticated comment actions
router.post('/', authenticateUser, createComment);
router.put('/:id', authenticateUser, updateComment);
router.delete('/:id', authenticateUser, deleteComment);
router.post('/:id/react', authenticateUser, toggleReaction);

module.exports = router;
