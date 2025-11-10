/**
 * Centralized Error Handler Middleware
 * Provides consistent error response format across all routes
 */

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error Handler Caught:', err);
  console.error('❌ Error Name:', err.name);
  console.error('❌ Error Message:', err.message);
  console.error('❌ Error Stack:', err.stack);
  console.error('❌ Request Path:', req.path);
  console.error('❌ Request Method:', req.method);

  // Default error status and message
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
    details = err.errors || err.details;
  }

  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Authentication failed';
  }

  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  }

  // Format error response
  const errorResponse = {
    success: false,
    error: message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      path: req.path,
      method: req.method
    })
  };

  res.status(status).json(errorResponse);
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  asyncHandler
};

