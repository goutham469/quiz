const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');

// Get questions by category
router.get('/questions', quizController.getQuestions);

// Submit quiz attempt
router.post('/submit', quizController.submitAttempt);

// Get user attempts
router.get('/attempts', quizController.getUserAttempts);

router.post("/add-questions", quizController.addQuestions);
router.get("/get-categories", quizController.getCategories);

module.exports = router;
