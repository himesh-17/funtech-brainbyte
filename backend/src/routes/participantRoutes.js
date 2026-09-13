const express = require('express');
const router = express.Router();

const { register, getQuiz, submitAnswers } = require('../controllers/participantController');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, submitAnswersSchema } = require('../utils/validationSchemas');
const { registrationLimiter, submitLimiter } = require('../middleware/rateLimiter');
const { asyncHandler } = require('../middleware/errorHandler');

// POST /api/register — Register a new participant (no password)
router.post(
  '/register',
  registrationLimiter,
  validate(registerSchema),
  asyncHandler(register)
);

// GET /api/quiz — Fetch quiz questions (JWT required, no correct answers)
router.get(
  '/quiz',
  asyncHandler(verifyToken),
  asyncHandler(getQuiz)
);

// POST /api/quiz/submit — Submit all answers atomically (JWT required)
router.post(
  '/quiz/submit',
  submitLimiter,
  asyncHandler(verifyToken),
  validate(submitAnswersSchema),
  asyncHandler(submitAnswers)
);

module.exports = router;
