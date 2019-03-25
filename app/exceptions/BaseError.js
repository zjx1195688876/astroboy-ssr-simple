/**
 * Base Error
 */
class BaseError extends Error {
  constructor(code, msg, extra = {}, type) {
    super(`code: ${code} msg: ${msg}`);
    this.errorContent = {
      code,
      msg,
      extra,
    };
    this.errorType = type || 'BaseError';
  }
}

module.exports = BaseError;
