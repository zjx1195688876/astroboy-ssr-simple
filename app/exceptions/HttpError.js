const BaseError = require('./BaseError');

class HttpError extends BaseError {
  constructor(code, msg, extra = {}) {
    super(code, msg, extra, 'HttpError');
  }
}

module.exports = HttpError;
