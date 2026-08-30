const {
    authenticateUser,
} = require("../middlewares/authMiddleware");

const express = require("express");

const router = express.Router();

const {
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
} = require("../controllers/quizController");


// ===============================
// QUIZ ROUTES
// ===============================

// Create Quiz
router.post("/", authenticateUser, createQuiz);

// Get All Quizzes
router.get("/", getAllQuizzes);

router.put("/:id/submit", authenticateUser, submitQuiz);

// Get Single Quiz
router.get("/:id", getQuizById);

// Update Quiz
router.put("/:id", authenticateUser, updateQuiz);

// Delete Quiz
router.delete("/:id", authenticateUser, deleteQuiz);


// ===============================
// QUESTION ROUTES
// ===============================

// Add Question
router.post("/:id/questions", authenticateUser, addQuestion);

// Update Question
router.put(
    "/:id/questions/:questionId",
    authenticateUser,
    updateQuestion
);

// Delete Question
router.delete(
    "/:id/questions/:questionId",
    authenticateUser,
    deleteQuestion
);


// ===============================
// ATTACH QUIZ TO ARTICLE
// ===============================

router.put(
    "/:id/attach/:articleId",
    authenticateUser,
    attachQuizToArticle
);


module.exports = router;