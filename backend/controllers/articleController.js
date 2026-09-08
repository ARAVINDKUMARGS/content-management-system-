const mongoose = require('mongoose');
const Article = require('../models/Article');

const getUserId = (req) => {
  return req.user.id || req.user._id;
};

const isArticleOwner = (article, userId) => {
  return article.author.toString() === userId.toString();
};

// Create a new article
const createArticle = async (req, res) => {
  try {
    const { title, description, content, category, tags } = req.body;

    const article = await Article.create({
      title,
      description,
      content,
      category,
      tags: Array.isArray(tags) ? tags : [],
      author: req.user._id,
      status: 'draft',
    });

    const populatedArticle = await Article.findById(article._id)
      .populate('author', 'name email role avatar');

    res.status(201).json({
      success: true,
      message: 'Article created successfully.',
      article: populatedArticle,
    });
  } catch (error) {
    console.error('Create article error:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create article.',
    });
  }
};

// Get all articles
const getArticles = async (req, res) => {
  try {
    const { status, category, search } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const articles = await Article.find(filter)
      .populate('author', 'name email role avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error('Get articles error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch articles.',
    });
  }
};

// Get single article
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name email role avatar bio')
      .populate('adminNote.reviewedBy', 'name email');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error('Get article error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch article.',
    });
  }
};

// Update article
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own articles.',
      });
    }

    const editableStatuses = [
      'draft',
      'rejected',
      'changes_requested',
    ];

    if (!editableStatuses.includes(article.status)) {
      return res.status(400).json({
        success: false,
        message: `Article cannot be edited while its status is '${article.status}'.`,
      });
    }

    const { title, description, content, category, tags } = req.body;

    if (title !== undefined) article.title = title;
    if (description !== undefined) article.description = description;
    if (content !== undefined) article.content = content;
    if (category !== undefined) article.category = category;

    if (tags !== undefined) {
      article.tags = Array.isArray(tags) ? tags : [];
    }

    if (
      article.status === 'rejected' ||
      article.status === 'changes_requested'
    ) {
      article.adminNote = {
        message: '',
        reviewedBy: null,
        reviewedAt: null,
      };
    }

    await article.save();

    const updatedArticle = await Article.findById(article._id)
      .populate('author', 'name email role avatar');

    res.status(200).json({
      success: true,
      message: 'Article updated successfully.',
      article: updatedArticle,
    });
  } catch (error) {
    console.error('Update article error:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update article.',
    });
  }
};

// Submit article for review
const submitArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only submit your own articles.',
      });
    }

    const allowedStatuses = [
      'draft',
      'rejected',
      'changes_requested',
    ];

    if (!allowedStatuses.includes(article.status)) {
      return res.status(400).json({
        success: false,
        message: `Article cannot be submitted from '${article.status}' status.`,
      });
    }

    article.status = 'pending';
    article.submittedAt = new Date();

    await article.save();

    res.status(200).json({
      success: true,
      message: 'Article submitted for review.',
      article,
    });
  } catch (error) {
    console.error('Submit article error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to submit article.',
    });
  }
};

// Admin approves article
const approveArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    if (article.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending articles can be approved.',
      });
    }

    article.status = 'approved';

    await article.save();

    const updatedArticle = await Article.findById(article._id)
      .populate('author', 'name email role avatar');

    res.status(200).json({
      success: true,
      message: 'Article approved successfully.',
      article: updatedArticle,
    });
  } catch (error) {
    console.error('Approve article error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to approve article.',
    });
  }
};

// Admin rejects article
const rejectArticle = async (req, res) => {
  try {
    const { adminNote } = req.body;

    if (!adminNote || !adminNote.trim()) {
      return res.status(400).json({
        success: false,
        message: 'An admin note is required when rejecting an article.',
      });
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    if (article.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending articles can be rejected.',
      });
    }

    article.status = 'rejected';

    article.adminNote = {
      message: adminNote.trim(),
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
    };

    await article.save();

    const updatedArticle = await Article.findById(article._id)
      .populate('author', 'name email role avatar')
      .populate('adminNote.reviewedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Article rejected successfully.',
      article: updatedArticle,
    });
  } catch (error) {
    console.error('Reject article error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to reject article.',
    });
  }
};

// Admin requests changes
const requestChanges = async (req, res) => {
  try {
    const { adminNote } = req.body;

    if (!adminNote || !adminNote.trim()) {
      return res.status(400).json({
        success: false,
        message: 'An admin note is required when requesting changes.',
      });
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    if (article.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending articles can have changes requested.',
      });
    }

    article.status = 'changes_requested';

    article.adminNote = {
      message: adminNote.trim(),
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
    };

    await article.save();

    const updatedArticle = await Article.findById(article._id)
      .populate('author', 'name email role avatar')
      .populate('adminNote.reviewedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Changes requested successfully.',
      article: updatedArticle,
    });
  } catch (error) {
    console.error('Request changes error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to request changes.',
    });
  }
};

// Publish approved article
const publishArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    if (article.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Only approved articles can be published.',
      });
    }

    article.status = 'published';
    article.publishedAt = new Date();

    await article.save();

    const updatedArticle = await Article.findById(article._id)
      .populate('author', 'name email role avatar');

    res.status(200).json({
      success: true,
      message: 'Article published successfully.',
      article: updatedArticle,
    });
  } catch (error) {
    console.error('Publish article error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to publish article.',
    });
  }
};

// Get articles belonging to logged-in author
const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      author: req.user._id,
    })
      .populate('author', 'name email role avatar')
      .populate('adminNote.reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error('Get my articles error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch your articles.',
    });
  }
};

const getMyArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID.',
      });
    }

    /*
     * First find the article WITHOUT populating the author.
     * This keeps article.author as the ObjectId so that
     * ownership checking works correctly.
     */
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    /*
     * Check ownership before populating the author.
     */
    if (!isArticleOwner(article, userId)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this article.',
      });
    }

    /*
     * Now populate the author after ownership has been verified.
     */
    await article.populate('author', 'name avatar bio');

    return res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error('[Get My Article Error]:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve article.',
    });
  }
};

// Get published articles by a specific author
const getPublishedArticlesByAuthor = async (req, res) => {
  try {
    const articles = await Article.find({
      author: req.params.id,
      status: 'published',
    })
      .populate('author', 'name role avatar bio')
      .sort({ publishedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error('Get published author articles error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch published articles.',
    });
  }
};

// Like an article
const likeArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    const userId = req.user._id.toString();

    if (article.likes?.some((id) => id.toString() === userId)) {
      return res.status(400).json({
        success: false,
        message: 'You have already liked this article.',
      });
    }

    article.likes = article.likes || [];
    article.likes.push(req.user._id);

    await article.save();

    res.status(200).json({
      success: true,
      message: 'Article liked successfully.',
      likes: article.likes.length,
    });
  } catch (error) {
    console.error('Like article error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to like article.',
    });
  }
};

// Increment article views
const incrementViews = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    res.status(200).json({
      success: true,
      views: article.views,
    });
  } catch (error) {
    console.error('Increment views error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to increment views.',
    });
  }
};

// Delete article
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    if (
      article.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own articles.',
      });
    }

    await Article.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully.',
    });
  } catch (error) {
    console.error('Delete article error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete article.',
    });
  }
};

const reviewArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewFeedback } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID.',
      });
    }

    const allowedStatuses = [
      'published',
      'changes_requested',
      'rejected',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid review status. Allowed values: published, changes_requested, rejected.',
      });
    }

    if (
      ['changes_requested', 'rejected'].includes(status) &&
      (!reviewFeedback || !reviewFeedback.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: 'Review feedback is required for this status.',
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    article.status = status;
    article.reviewFeedback = reviewFeedback
      ? reviewFeedback.trim()
      : '';

    await article.save();

    const reviewedArticle = await Article.findById(article._id).populate(
      'author',
      'name avatar bio'
    );

    return res.status(200).json({
      success: true,
      message: `Article status changed to '${status}'.`,
      article: reviewedArticle,
    });
  } catch (error) {
    console.error('[Review Article Error]:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to review article.',
    });
  }
};

// ==========================================
// GET ALL ARTICLES - ADMIN
// ==========================================

const getAllArticlesForAdmin = async (req, res) => {
  try {
    const articles = await Article.find({status: { $ne: 'draft' },})
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error('Get Admin Articles Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch articles',
      error: error.message,
    });
  }
};

module.exports = {
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
  getMyArticleById,
  getPublishedArticlesByAuthor,
  likeArticle,
  incrementViews,
  deleteArticle,
  reviewArticle,
  getAllArticlesForAdmin,
};