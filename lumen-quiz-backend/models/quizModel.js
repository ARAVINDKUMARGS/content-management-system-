const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },

        options: {
            type: [String],
            required: true,
            validate: {
                validator: function (options) {
                    return options.length === 4;
                },
                message: "A question must have exactly 4 options",
            },
        },

        correctAnswer: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        _id: true,
    }
);

const quizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        articleId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: null,
        },

        questions: {
            type: [questionSchema],
            default: [],
        },

        status: {
            type: String,
            enum: ["draft", "submitted", "approved", "rejected"],
            default: "draft",
        },
    },
    {
        timestamps: true,
    }
);

const quizModel = mongoose.model("quiz", quizSchema);

module.exports = quizModel;