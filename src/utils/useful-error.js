class UsefulError extends Error {
  constructor(message, httpStatusCode = 500) {
    super();
    this.message = message;
    this.httpStatusCode = httpStatusCode;
  }
}

module.exports = UsefulError;