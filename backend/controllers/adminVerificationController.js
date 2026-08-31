const mongoose = require("mongoose");
const AdminVerificationArticle = require("../models/AdminVerificationArticle");

// =====================================================
// EXISTING QUIZ COLLECTION
// =====================================================

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      trim: true,
    },

    options: {
      type: [String],
      default: [],
    },

    correctAnswer: {
      type: String,
      trim: true,
    },
  },
  {
    _id: true,
  }
);

const adminVerificationQuizSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    questions: {
      type: [questionSchema],
      default: [],
    },

    status: {
      type: String,
      default: "draft",
    },

    reviewFeedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "quizzes",
  }
);

const AdminVerificationQuiz =
  mongoose.models.AdminVerificationQuiz ||
  mongoose.model(
    "AdminVerificationQuiz",
    adminVerificationQuizSchema
  );

// =====================================================
// GET PENDING ARTICLES
// =====================================================

const getPendingArticles = async (req, res) => {
  try {
    const articles = await AdminVerificationArticle.find({
      status: "pending_review",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error("Get pending articles error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pending articles.",
    });
  }
};

// =====================================================
// GET PENDING QUIZZES
// =====================================================

const getPendingQuizzes = async (req, res) => {
  try {
    const quizzes = await AdminVerificationQuiz.find({
      status: "submitted",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    console.error("Get pending quizzes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pending quizzes.",
    });
  }
};

// =====================================================
// APPROVE ARTICLE
// =====================================================

const approveArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID.",
      });
    }

    const article = await AdminVerificationArticle.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    if (article.status !== "pending_review") {
      return res.status(400).json({
        success: false,
        message: "Article is not pending review.",
      });
    }

    article.status = "approved";
    article.reviewFeedback = "";

    await article.save();

    res.status(200).json({
      success: true,
      message: "Article approved successfully.",
      data: article,
    });
  } catch (error) {
    console.error("Approve article error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to approve article.",
    });
  }
};

// =====================================================
// REJECT ARTICLE
// =====================================================

const rejectArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID.",
      });
    }

    const article = await AdminVerificationArticle.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    if (article.status !== "pending_review") {
      return res.status(400).json({
        success: false,
        message: "Article is not pending review.",
      });
    }

    article.status = "rejected";
    article.reviewFeedback = reason.trim();

    await article.save();

    res.status(200).json({
      success: true,
      message: "Article rejected successfully.",
      data: article,
    });
  } catch (error) {
    console.error("Reject article error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reject article.",
    });
  }
};

// =====================================================
// REQUEST CHANGES FOR ARTICLE
// =====================================================

const requestArticleChanges = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feedback comment is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID.",
      });
    }

    const article = await AdminVerificationArticle.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    if (article.status !== "pending_review") {
      return res.status(400).json({
        success: false,
        message: "Article is not pending review.",
      });
    }

    article.status = "changes_requested";
    article.reviewFeedback = comment.trim();

    await article.save();

    res.status(200).json({
      success: true,
      message: "Changes requested successfully.",
      data: article,
    });
  } catch (error) {
    console.error("Request article changes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to request article changes.",
    });
  }
};

// =====================================================
// APPROVE QUIZ
// =====================================================

const approveQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID.",
      });
    }

    const quiz = await AdminVerificationQuiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      });
    }

    if (quiz.status !== "submitted") {
      return res.status(400).json({
        success: false,
        message: "Quiz is not pending review.",
      });
    }

    quiz.status = "approved";
    quiz.reviewFeedback = "";

    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz approved successfully.",
      data: quiz,
    });
  } catch (error) {
    console.error("Approve quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to approve quiz.",
    });
  }
};

// =====================================================
// REJECT QUIZ
// =====================================================

const rejectQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID.",
      });
    }

    const quiz = await AdminVerificationQuiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      });
    }

    if (quiz.status !== "submitted") {
      return res.status(400).json({
        success: false,
        message: "Quiz is not pending review.",
      });
    }

    quiz.status = "rejected";
    quiz.reviewFeedback = reason.trim();

    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz rejected successfully.",
      data: quiz,
    });
  } catch (error) {
    console.error("Reject quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reject quiz.",
    });
  }
};

// =====================================================
// REQUEST CHANGES FOR QUIZ
// =====================================================

const requestQuizChanges = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feedback comment is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID.",
      });
    }

    const quiz = await AdminVerificationQuiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      });
    }

    if (quiz.status !== "submitted") {
      return res.status(400).json({
        success: false,
        message: "Quiz is not pending review.",
      });
    }

    quiz.status = "changes_requested";
    quiz.reviewFeedback = comment.trim();

    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Changes requested successfully.",
      data: quiz,
    });
  } catch (error) {
    console.error("Request quiz changes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to request quiz changes.",
    });
  }
};
// =====================================================
// GET ADMIN VERIFICATION STATISTICS
// =====================================================

const getVerificationStats = async (req, res) => {
  try {
    const [
      pendingArticles,
      changesArticles,
      approvedArticles,
      rejectedArticles,
      pendingQuizzes,
      changesQuizzes,
      approvedQuizzes,
      rejectedQuizzes,
    ] = await Promise.all([
      AdminVerificationArticle.countDocuments({
        status: "pending_review",
      }),

      AdminVerificationArticle.countDocuments({
        status: "changes_requested",
      }),

      AdminVerificationArticle.countDocuments({
        status: "approved",
      }),

      AdminVerificationArticle.countDocuments({
        status: "rejected",
      }),

      AdminVerificationQuiz.countDocuments({
        status: "submitted",
      }),

      AdminVerificationQuiz.countDocuments({
        status: "changes_requested",
      }),

      AdminVerificationQuiz.countDocuments({
        status: "approved",
      }),

      AdminVerificationQuiz.countDocuments({
        status: "rejected",
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        pending: pendingArticles + pendingQuizzes,
        changesRequested:
          changesArticles + changesQuizzes,
        published:
          approvedArticles + approvedQuizzes,
        rejected:
          rejectedArticles + rejectedQuizzes,
      },
    });
  } catch (error) {
    console.error(
      "Get verification statistics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch verification statistics.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getPendingArticles,
  getPendingQuizzes,

  approveArticle,
  rejectArticle,
  requestArticleChanges,

  approveQuiz,
  rejectQuiz,
  requestQuizChanges,
  getVerificationStats,
};