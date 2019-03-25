class PageException extends Error {
  constructor(code, msg) {
    super(`code: ${code}, msg: ${msg}`);
    this.errorContent = {
      code,
      msg
    };
  }
}

module.exports = PageException;
