const BaseError = require('./BaseError');

class ServiceError extends BaseError {
  constructor(code, msg, extra = {}) {
    super(code, msg, extra, 'ServiceError');
  }
}

module.exports = ServiceError;
