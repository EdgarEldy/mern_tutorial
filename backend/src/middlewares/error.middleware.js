const { NODE_ENV } = require('../config/env');
const apiResponse = require('../shared/utils/apiResponse');

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const extra = NODE_ENV === 'development' ? { stack: err.stack } : null;
  return apiResponse.error(res, message, statusCode, extra);
};

module.exports = errorMiddleware;
