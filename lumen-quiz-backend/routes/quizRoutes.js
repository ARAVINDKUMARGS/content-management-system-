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
router.post("/", createQuiz);

// Get All Quizzes
router.get("/", getAllQuizzes);

router.put("/:id/submit", submitQuiz);

// Get Single Quiz
router.get("/:id", getQuizById);

// Update Quiz
router.put("/:id", updateQuiz);

// Delete Quiz
router.delete("/:id", deleteQuiz);


// ===============================
// QUESTION ROUTES
// ===============================

// Add Question
router.post("/:id/questions", addQuestion);

// Update Question
router.put("/:id/questions/:questionId", updateQuestion);

// Delete Question
router.delete("/:id/questions/:questionId", deleteQuestion);


// ===============================
// ATTACH QUIZ TO ARTICLE
// ===============================

router.put(
    "/:id/attach/:articleId",
    attachQuizToArticle
);


module.exports = router;