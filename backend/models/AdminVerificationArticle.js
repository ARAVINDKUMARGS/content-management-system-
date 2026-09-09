const mongoose = require("mongoose");

const adminVerificationArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    readingTime: {
      type: String,
      default: "5 min",
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending_review",
        "approved",
        "rejected",
        "changes_requested",
      ],
      default: "pending_review",
    },

    reviewFeedback: {
      type: String,
      default: "",
      trim: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AdminVerificationArticle",
  adminVerificationArticleSchema
);