const { ZodError } = require('zod');

/**
 * Creates an Express middleware that validates req.body against a Zod schema.
 *
 * Usage:
 *   const { registerSchema } = require('../utils/validationSchemas');
 *   router.post('/register', validate(registerSchema), controller);
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      // parse() throws ZodError on failure, returns parsed data on success
      const parsed = schema.parse(req.body);
      // Replace req.body with the parsed (and transformed/trimmed) data
      req.body = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
      }
      // Not a Zod error — pass to global error handler
      next(err);
    }
  };
}

module.exports = validate;
