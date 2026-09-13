/**
 * Wraps an async route handler to catch rejected promises
 * and forward them to Express error-handling middleware.
 *
 * Usage: router.get('/path', asyncHandler(myController));
 *
 * @param {Function} fn - Async route handler (req, res, next) => Promise
 * @returns {Function} Wrapped handler
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Global error-handling middleware.
 * Must be registered AFTER all routes in app.js.
 *
 * Catches any error thrown or passed via next(err) in route handlers,
 * logs it, and returns a structured JSON error response.
 */
// eslint-disable-next-line no-unused-vars
function globalErrorHandler(err, req, res, next) {
  // Log the full error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Unhandled Error:', err);
  } else {
    console.error('❌ Error:', err.message);
  }

  // Mongoose validation error → 400
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
  }

  // Mongoose CastError (e.g., invalid ObjectId) → 400
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // MongoDB duplicate key → 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value for field: ${field}`,
    });
  }

  // Default: 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = { asyncHandler, globalErrorHandler };
