const Question = require('../models/Question');
const Participant = require('../models/Participant');

// ═══════════════════════════════════════════════════════════
// Question CRUD
// ═══════════════════════════════════════════════════════════

/**
 * POST /admin/questions
 * Add a new question.
 */
async function addQuestion(req, res) {
  const { questionText, options, correctOptionKey, marks, order } = req.body;

  // Validate that correctOptionKey matches one of the option keys
  const optionKeys = options.map((o) => o.key);
  if (!optionKeys.includes(correctOptionKey)) {
    return res.status(400).json({
      success: false,
      message: `correctOptionKey "${correctOptionKey}" does not match any option key. Available keys: ${optionKeys.join(', ')}`,
    });
  }

  const question = await Question.create({
    questionText,
    options,
    correctOptionKey,
    marks: marks ?? 1,
    order: order ?? 0,
  });

  res.status(201).json({
    success: true,
    message: 'Question created',
    data: { question },
  });
}

/**
 * GET /admin/questions
 * List all questions (with correct answers — admin only).
 */
async function listQuestions(req, res) {
  const questions = await Question.find({}).sort({ order: 1 }).lean();

  res.status(200).json({
    success: true,
    data: {
      questions,
      totalQuestions: questions.length,
    },
  });
}

/**
 * PUT /admin/questions/:id
 * Update an existing question.
 */
async function updateQuestion(req, res) {
  const { id } = req.params;
  const updates = req.body;

  // If updating options and correctOptionKey, validate they match
  if (updates.options && updates.correctOptionKey) {
    const optionKeys = updates.options.map((o) => o.key);
    if (!optionKeys.includes(updates.correctOptionKey)) {
      return res.status(400).json({
        success: false,
        message: `correctOptionKey "${updates.correctOptionKey}" does not match any option key.`,
      });
    }
  }

  const question = await Question.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Question updated',
    data: { question },
  });
}

/**
 * DELETE /admin/questions/:id
 * Delete a question.
 */
async function deleteQuestion(req, res) {
  const question = await Question.findByIdAndDelete(req.params.id);

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Question deleted',
  });
}

// ═══════════════════════════════════════════════════════════
// Results & Participants
// ═══════════════════════════════════════════════════════════

/**
 * GET /admin/results
 * Full leaderboard: all submitted participants sorted by score (desc),
 * then by time taken (asc) as tiebreaker.
 */
async function getResults(req, res) {
  const results = await Participant.find({ submitted: true })
    .select('name email rollNumber score timeTakenSeconds submittedAt')
    .sort({ score: -1, timeTakenSeconds: 1 })
    .lean();

  // Add rank
  const rankedResults = results.map((r, index) => ({
    rank: index + 1,
    ...r,
  }));

  res.status(200).json({
    success: true,
    data: {
      results: rankedResults,
      totalSubmissions: rankedResults.length,
    },
  });
}

/**
 * GET /admin/participants
 * All registered participants with attempt status.
 */
async function getParticipants(req, res) {
  const participants = await Participant.find({})
    .select('name email rollNumber registeredAt submitted score timeTakenSeconds submittedAt')
    .sort({ registeredAt: -1 })
    .lean();

  const stats = {
    totalRegistered: participants.length,
    totalSubmitted: participants.filter((p) => p.submitted).length,
    totalPending: participants.filter((p) => !p.submitted).length,
  };

  res.status(200).json({
    success: true,
    data: {
      participants,
      stats,
    },
  });
}

module.exports = {
  addQuestion,
  listQuestions,
  updateQuestion,
  deleteQuestion,
  getResults,
  getParticipants,
};
