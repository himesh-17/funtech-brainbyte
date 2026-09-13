const express = require('express');
const router = express.Router();

const {
  addQuestion,
  listQuestions,
  updateQuestion,
  deleteQuestion,
  getResults,
  getParticipants,
} = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { questionSchema, questionUpdateSchema } = require('../utils/validationSchemas');
const { asyncHandler } = require('../middleware/errorHandler');

// All admin routes require the x-admin-secret header
router.use(verifyAdmin);

// ── Question CRUD ──────────────────────────────────────────
router.post('/questions', validate(questionSchema), asyncHandler(addQuestion));
router.get('/questions', asyncHandler(listQuestions));
router.put('/questions/:id', validate(questionUpdateSchema), asyncHandler(updateQuestion));
router.delete('/questions/:id', asyncHandler(deleteQuestion));

// ── Results & Participants ─────────────────────────────────
router.get('/results', asyncHandler(getResults));
router.get('/participants', asyncHandler(getParticipants));

module.exports = router;
