const { z } = require('zod');

// ── Registration ───────────────────────────────────────────
const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(1, 'Name cannot be empty')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email format')
    .max(254, 'Email too long'),
  rollNumber: z
    .string()
    .trim()
    .max(50, 'Roll number too long')
    .optional()
    .nullable(),
});

// ── Answer Submission ──────────────────────────────────────
const submitAnswersSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z
          .string({ required_error: 'questionId is required' })
          .regex(/^[0-9a-fA-F]{24}$/, 'Invalid questionId format'),
        selectedOptionKey: z
          .string({ required_error: 'selectedOptionKey is required' })
          .trim()
          .min(1, 'selectedOptionKey cannot be empty'),
      })
    )
    .min(1, 'At least one answer is required'),
  timeTakenSeconds: z
    .number({ required_error: 'timeTakenSeconds is required' })
    .int('timeTakenSeconds must be an integer')
    .min(0, 'timeTakenSeconds cannot be negative')
    .max(86400, 'timeTakenSeconds seems unreasonably large'),
});

// ── Admin: Create/Update Question ──────────────────────────
const questionSchema = z.object({
  questionText: z
    .string({ required_error: 'questionText is required' })
    .trim()
    .min(1, 'Question text cannot be empty'),
  options: z
    .array(
      z.object({
        key: z
          .string({ required_error: 'Option key is required' })
          .trim()
          .min(1, 'Option key cannot be empty'),
        text: z
          .string({ required_error: 'Option text is required' })
          .trim()
          .min(1, 'Option text cannot be empty'),
      })
    )
    .min(2, 'At least 2 options are required'),
  correctOptionKey: z
    .string({ required_error: 'correctOptionKey is required' })
    .trim()
    .min(1, 'correctOptionKey cannot be empty'),
  marks: z.number().min(0, 'Marks cannot be negative').optional(),
  order: z.number().int().optional(),
});

// Partial version for PATCH/PUT updates (all fields optional)
const questionUpdateSchema = questionSchema.partial();

module.exports = {
  registerSchema,
  submitAnswersSchema,
  questionSchema,
  questionUpdateSchema,
};
