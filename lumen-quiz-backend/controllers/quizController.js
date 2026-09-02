const mongoose = require("mongoose");
const quizModel = require("../models/quizModel");

// ==========================================
// CREATE QUIZ
// ==========================================

const createQuiz = async (req, res) => {
    try {
        const { title, description, articleId, questions } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Quiz title is required",
            });
        }

        if (!questions || questions.length === 0) {
            return res.status(400).json({
                message: "Quiz must have at least one question",
            });
        }

        if (questions.length > 0) {
            for (const question of questions) {
                if (!question.question) {
                    return res.status(400).json({
                        message: "Question text is required",
                    });
                }

                if (!question.options || question.options.length !== 4) {
                    return res.status(400).json({
                        message: "Each question must have exactly 4 options",
                    });
                }

                const trimmedOptions = question.options.map(
                    (option) => option.trim()
                );

                if (trimmedOptions.some((option) => !option)) {
                    return res.status(400).json({
                        message: "All options are required",
                    });
                }

                if (new Set(trimmedOptions).size !== 4) {
                    return res.status(400).json({
                        message: "All options must be different",
                    });
                }

                if (!question.correctAnswer) {
                    return res.status(400).json({
                        message: "Correct answer is required",
                    });
                }

                const correctAnswer = question.correctAnswer.trim();

                if (!question.options.some(
                    (option) => option.trim() === correctAnswer
                )) {
                    return res.status(400).json({
                        message: "Correct answer must match one of the options",
                    });
                }
            }
        }

        const existingQuiz = await quizModel.findOne({
            title: title.trim()
        });

        if (existingQuiz) {
            return res.status(400).json({
                message: "A quiz with this title already exists"
            });
        }

        const quiz = await quizModel.create({
            title,
            description,
            articleId: articleId || null,
            createdBy: req.user.id || req.user._id,
            questions: questions || [],
        });

        return res.status(201).json({
            message: "Quiz created successfully",
            quiz,
        });

    } catch (error) {
        console.error("Create Quiz Error:", error);

        return res.status(500).json({
            message: "Failed to create quiz",
            error: error.message,
        });
    }
};


// ==========================================
// GET ALL QUIZZES
// ==========================================

const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await quizModel
            .find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Quizzes fetched successfully",
            quizzes,
        });

    } catch (error) {
        console.error("Get Quizzes Error:", error);

        return res.status(500).json({
            message: "Failed to fetch quizzes",
            error: error.message,
        });
    }
};


// ==========================================
// GET SINGLE QUIZ
// ==========================================

const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;

        const quiz = await quizModel.findById(id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        return res.status(200).json({
            message: "Quiz fetched successfully",
            quiz,
        });

    } catch (error) {
        console.error("Get Quiz Error:", error);

        return res.status(500).json({
            message: "Failed to fetch quiz",
            error: error.message,
        });
    }
};


// ==========================================
// UPDATE QUIZ
// ==========================================

const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        const quiz = await quizModel.findById(id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        if (quiz.status !== "draft") {
            return res.status(400).json({
                message: "Only draft quizzes can be updated"
            });
        }

        const {
            title,
            description,
            questions,
            articleId,
        } = req.body;

        if (title !== undefined && !title.trim()) {
            return res.status(400).json({
                message: "Quiz title is required"
            });
        }

        if (title !== undefined) {

            const existingQuiz = await quizModel.findOne({
                title: title.trim(),
                _id: { $ne: id }
            });

            if (existingQuiz) {
                return res.status(400).json({
                    message: "A quiz with this title already exists"
                });
            }
        }

        if (questions) {
            for (const question of questions) {
                if (!question.question || !question.question.trim()) {
                    return res.status(400).json({
                        message: "Question text is required",
                    });
                }

                if (!question.options || question.options.length !== 4) {
                    return res.status(400).json({
                        message: "Each question must have exactly 4 options",
                    });
                }

                const trimmedOptions = question.options.map(
                    (option) => option.trim()
                );

                if (trimmedOptions.some((option) => !option)) {
                    return res.status(400).json({
                        message: "All options are required",
                    });
                }

                if (new Set(trimmedOptions).size !== 4) {
                    return res.status(400).json({
                        message: "All options must be different",
                    });
                }

                if (!question.correctAnswer) {
                    return res.status(400).json({
                        message: "Correct answer is required",
                    });
                }

                const correctAnswer = question.correctAnswer.trim();

                if (!question.options.some(
                    (option) => option.trim() === correctAnswer
                )) {
                    return res.status(400).json({
                        message: "Correct answer must match one of the options",
                    });
                }
            }
        }

        if (title !== undefined) {
            quiz.title = title;
        }

        if (description !== undefined) {
            quiz.description = description;
        }

        if (questions !== undefined) {
            quiz.questions = questions;
        }

        if (articleId !== undefined) {
            quiz.articleId = articleId;
        }

        await quiz.save();

        return res.status(200).json({
            message: "Quiz updated successfully",
            quiz,
        });

    } catch (error) {
        console.error("Update Quiz Error:", error);

        return res.status(500).json({
            message: "Failed to update quiz",
            error: error.message,
        });
    }
};


// ==========================================
// DELETE QUIZ
// ==========================================

const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        const quiz = await quizModel.findById(id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        if (quiz.status !== "draft") {
            return res.status(400).json({
                message: "Only draft quizzes can be deleted"
            });
        }

        await quiz.deleteOne();

        return res.status(200).json({
            message: "Quiz deleted successfully",
        });

    } catch (error) {
        console.error("Delete Quiz Error:", error);

        return res.status(500).json({
            message: "Failed to delete quiz",
            error: error.message,
        });
    }
};


// ==========================================
// ADD QUESTION
// ==========================================

const addQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            question,
            options,
            correctAnswer,
        } = req.body;

        if (!question || !question.trim() || !options || !correctAnswer) {
            return res.status(400).json({
                message: "Question, options and correct answer are required",
            });
        }

        if (!Array.isArray(options) || options.length !== 4) {
            return res.status(400).json({
                message: "A question must have exactly 4 options",
            });
        }

        const trimmedOptions = options.map(
            (option) => option.trim()
        );

        if (trimmedOptions.some((option) => !option)) {
            return res.status(400).json({
                message: "All options are required",
            });
        }

        if (new Set(trimmedOptions).size !== 4) {
            return res.status(400).json({
                message: "All options must be different",
            });
        }

        const trimmedCorrectAnswer = correctAnswer.trim();

        if (!options.some(
            (option) => option.trim() === trimmedCorrectAnswer
        )) {
            return res.status(400).json({
                message: "Correct answer must match one of the options",
            });
        }

        const quiz = await quizModel.findById(id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        quiz.questions.push({
            question,
            options,
            correctAnswer,
        });

        await quiz.save();

        return res.status(201).json({
            message: "Question added successfully",
            quiz,
        });

    } catch (error) {
        console.error("Add Question Error:", error);

        return res.status(500).json({
            message: "Failed to add question",
            error: error.message,
        });
    }
};


// ==========================================
// UPDATE QUESTION
// ==========================================

const updateQuestion = async (req, res) => {
    try {
        const { id, questionId } = req.params;

        const quiz = await quizModel.findById(id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        if (quiz.status !== "draft") {
            return res.status(400).json({
                message: "Only draft quizzes can be modified"
            });
        }

        const question = quiz.questions.id(questionId);

        if (!question) {
            return res.status(404).json({
                message: "Question not found",
            });
        }

        const {
            question: questionText,
            options,
            correctAnswer,
        } = req.body;

        if (questionText !== undefined) {
            question.question = questionText;
        }

        if (!question.question || !question.question.trim()) {
            return res.status(400).json({
                message: "Question text is required"
            });
        }

        if (options !== undefined) {
            if (!Array.isArray(options) || options.length !== 4) {
                return res.status(400).json({
                    message: "A question must have exactly 4 options",
                });
            }

            question.options = options;
        }

        if (correctAnswer !== undefined) {
            question.correctAnswer = correctAnswer;
        }

        const trimmedCorrectAnswer = question.correctAnswer.trim();

        if (!question.options.some(
            (option) => option.trim() === trimmedCorrectAnswer
        )) {
            return res.status(400).json({
                message: "Correct answer must match one of the options",
            });
        }

        await quiz.save();

        return res.status(200).json({
            message: "Question updated successfully",
            quiz,
        });

    } catch (error) {
        console.error("Update Question Error:", error);

        return res.status(500).json({
            message: "Failed to update question",
            error: error.message,
        });
    }
};


// ==========================================
// DELETE QUESTION
// ==========================================

const deleteQuestion = async (req, res) => {
    try {
        const { id, questionId } = req.params;

        const quiz = await quizModel.findById(id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        if (quiz.status !== "draft") {
            return res.status(400).json({
                message: "Only draft quizzes can be modified"
            });
        }

        const question = quiz.questions.id(questionId);

        if (!question) {
            return res.status(404).json({
                message: "Question not found",
            });
        }

        question.deleteOne();

        await quiz.save();

        return res.status(200).json({
            message: "Question deleted successfully",
            quiz,
        });

    } catch (error) {
        console.error("Delete Question Error:", error);

        return res.status(500).json({
            message: "Failed to delete question",
            error: error.message,
        });
    }
};


// ==========================================
// ATTACH QUIZ TO ARTICLE
// ==========================================

const attachQuizToArticle = async (req, res) => {
    try {
        const { id, articleId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid quiz ID"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(articleId)) {
            return res.status(400).json({
                message: "Invalid Article ID"
            });
        }

        const quiz = await quizModel.findById(id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        if (quiz.status !== "draft") {
            return res.status(400).json({
                message: "Only draft quizzes can be attached to an article"
            });
        }

        quiz.articleId = articleId;

        await quiz.save();

        return res.status(200).json({
            message: "Quiz attached to article successfully",
            quiz,
        });

    } catch (error) {
        console.error("Attach Quiz Error:", error);
        console.log(
            "Validation Errors:",
            error.errors
        );

        return res.status(500).json({
            message: "Failed to attach quiz to article",
            error: error.message,
        });
    }
};

// ==========================================
// SUBMIT QUIZ FOR ADMIN REVIEW
// ==========================================

const submitQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        const quiz = await quizModel.findById(id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        if (quiz.status !== "draft") {
            return res.status(400).json({
                message: "Only draft quizzes can be modified"
            });
        }

        // Quiz must be in draft status
        if (quiz.status !== "draft") {
            return res.status(400).json({
                message: "Only draft quizzes can be submitted",
            });
        }

        // Quiz must have at least one question
        if (!quiz.questions || quiz.questions.length === 0) {
            return res.status(400).json({
                message: "Quiz must have at least one question",
            });
        }

        quiz.status = "submitted";

        await quiz.save();

        return res.status(200).json({
            message: "Quiz submitted for admin review",
            quiz,
        });

    } catch (error) {
        console.error("Submit Quiz Error:", error);

        return res.status(500).json({
            message: "Failed to submit quiz",
            error: error.message,
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    attachQuizToArticle,
    submitQuiz,
};