
class ApiRequestError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiRequestError };
