import logger from '../lib/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error('Error: %s', err.message, { stack: err.stack, url: req.originalUrl });
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

export default errorHandler; 