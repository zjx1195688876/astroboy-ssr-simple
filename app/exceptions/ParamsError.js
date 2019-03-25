const BaseError = require('./BaseError');

class ParamsError extends BaseError {
  constructor(code, msg, extra = {}) {
    super(code, msg, extra, 'ParamsError');
  }
}

module.exports = ParamsError;
