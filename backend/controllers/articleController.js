const mongoose = require('mongoose');
const Article = require('../models/Article');

/**
 * Helper function to get authenticated user's ID.
 */
const getUserId = (req) => {
  return req.user.id || req.user._id;
};

/**
 * Helper function to check whether the article belongs to the user.
 */
const isArticleOwner = (article, userId) => {
  return article.author.toString() === userId.toString();
};

/**
 * @desc    Get all published articles
 * @route   GET /api/articles
 * @access  Public
 */
const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' })
      .populate('author', 'name avatar bio')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error('[Get Articles Error]:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve articles.',
    });
  }
};

/**
 * @desc    Get single article
 * @route   GET /api/articles/:id
 * @access  Public
 */
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID.',
      });
    }

    const article = await Article.findById(id).populate(
      'author',
      'name avatar bio'
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    /*
     * Only published articles are publicly accessible.
     * Authors/admins can access their own or relevant articles
     * through protected routes later if required.
     */
    if (article.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Article is not publicly available.',
      });
    }

    return res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error('[Get Article Error]:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve article.',
    });
  }
};

/**
 * @desc    Get logged-in author's articles
 * @route   GET /api/articles/my
 * @access  Private - Author
 */
const getMyArticles = async (req, res) => {
  try {
    const userId = getUserId(req);

    const articles = await Article.find({
      author: userId,
    })
      .populate('author', 'name avatar bio')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error('[Get My Articles Error]:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve your articles.',
    });
  }
};

/**
 * @desc    Get a specific article for editing
 * @route   GET /api/articles/my/:id
 * @access  Private - Author
 */
/*const getMyArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID.',
      });
    }

    const article = await Article.findById(id).populate(
      'author',
      'name avatar bio'
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    if (!isArticleOwner(article, userId)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this article.',
      });
    }

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
}; */
/**
 * @desc    Get a specific article for editing
 * @route   GET /api/articles/my/:id
 * @access  Private - Author
 */
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

/**
 * @desc    Create a new article
 * @route   POST /api/articles
 * @access  Private - Author
 */
const createArticle = async (req, res) => {
  try {
    const userId = getUserId(req);

    const {
      title,
      category,
      tags,
      content,
      videoUrl,
      quiz,
      status,
    } = req.body;

    /*
     * Validate basic fields.
     */
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Article title is required.',
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Article category is required.',
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Article content is required.',
      });
    }

    /*
     * An author should only create drafts through this endpoint.
     * Submission is handled separately through /submit.
     */
    const articleStatus = 'draft';

    const article = await Article.create({
      title: title.trim(),
      category: category.trim(),

      tags: Array.isArray(tags)
        ? tags.map((tag) => tag.trim()).filter(Boolean)
        : [],

      content: content.trim(),

      videoUrl: videoUrl ? videoUrl.trim() : '',

      author: userId,

      status: articleStatus,

      quiz: quiz || {
        enabled: false,
      },
    });

    const populatedArticle = await Article.findById(article._id).populate(
      'author',
      'name avatar bio'
    );

    return res.status(201).json({
      success: true,
      message: 'Article draft saved successfully.',
      article: populatedArticle,
    });
  } catch (error) {
    console.error('[Create Article Error]:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(', '),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create article.',
    });
  }
};

/**
 * @desc    Update an existing article
 * @route   PUT /api/articles/:id
 * @access  Private - Article Owner
 */
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID.',
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    /*
     * IMPORTANT:
     * Only the article owner can edit it.
     */
    if (!isArticleOwner(article, userId)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this article.',
      });
    }

    if (article.status === 'pending_review') {
      return res.status(400).json({
        success: false,
        message: 'Article cannot be edited while it is under review.',
      });
    }

    /*
     * Do not allow an author to directly change status.
     * Status changes happen through dedicated endpoints.
     */
    const {
      title,
      category,
      tags,
      content,
      videoUrl,
      quiz,
    } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Article title cannot be empty.',
        });
      }

      article.title = title.trim();
    }

    if (category !== undefined) {
      if (!category.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Article category cannot be empty.',
        });
      }

      article.category = category.trim();
    }

    if (tags !== undefined) {
      article.tags = Array.isArray(tags)
        ? tags.map((tag) => tag.trim()).filter(Boolean)
        : [];
    }

    if (content !== undefined) {
      if (!content.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Article content cannot be empty.',
        });
      }

      article.content = content.trim();
    }

    if (videoUrl !== undefined) {
      article.videoUrl = videoUrl.trim();
    }

    if (quiz !== undefined) {
      article.quiz = quiz;
    }

    /*
     * If an article was marked changes_requested and the author
     * edits it, keep the article editable. It will become pending_review
     * only when the author explicitly submits it again.
     */
    await article.save();

    const updatedArticle = await Article.findById(article._id).populate(
      'author',
      'name avatar bio'
    );

    return res.status(200).json({
      success: true,
      message: 'Article updated successfully.',
      article: updatedArticle,
    });
  } catch (error) {
    console.error('[Update Article Error]:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update article.',
    });
  }
};

/**
 * @desc    Delete an article
 * @route   DELETE /api/articles/:id
 * @access  Private - Article Owner
 */
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID.',
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    /*
     * Only the article owner can delete it.
     */
    if (!isArticleOwner(article, userId)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this article.',
      });
    }

    if (article.status === 'pending_review') {
      return res.status(400).json({
        success: false,
        message: 'Article cannot be deleted while it is under review.',
      });
    }

    await Article.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Article deleted successfully.',
    });
  } catch (error) {
    console.error('[Delete Article Error]:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete article.',
    });
  }
};

/**
 * @desc    Submit article for admin review
 * @route   PATCH /api/articles/:id/submit
 * @access  Private - Article Owner
 */
const submitArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID.',
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    if (!isArticleOwner(article, userId)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to submit this article.',
      });
    }

    /*
     * Only drafts or articles requiring changes can be submitted again.
     */
    if (
      !['draft', 'changes_requested', 'rejected'].includes(article.status)
    ) {
      return res.status(400).json({
        success: false,
        message: `Article cannot be submitted while its status is '${article.status}'.`,
      });
    }

    /*
     * Validate required content before submission.
     */
    if (!article.title || !article.title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Article title is required before submission.',
      });
    }

    if (!article.category || !article.category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Article category is required before submission.',
      });
    }

    if (!article.content || !article.content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Article content is required before submission.',
      });
    }

    article.status = 'pending_review';

    /*
     * Clear old review feedback after resubmission.
     */
    article.reviewFeedback = '';

    await article.save();

    const submittedArticle = await Article.findById(article._id).populate(
      'author',
      'name avatar bio'
    );

    return res.status(200).json({
      success: true,
      message: 'Article submitted for admin review.',
      article: submittedArticle,
    });
  } catch (error) {
    console.error('[Submit Article Error]:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to submit article for review.',
    });
  }
};

/**
 * @desc    Admin review an article
 * @route   PATCH /api/articles/:id/review
 * @access  Private - Admin
 */
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

module.exports = {
  getArticles,
  getArticleById,
  getMyArticles,
  getMyArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  submitArticle,
  reviewArticle,
};