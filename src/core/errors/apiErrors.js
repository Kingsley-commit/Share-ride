// Define a type for error details descriptor
/**
 * @typedef {Object} ErrorDetailsDescriptor
 * @property {string} message - Error message
 * @property {string} path - Path where the error occurred
 */

// Base class for API errors
class ApiError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);

    // Abstract properties (use methods to simulate abstract getters)
    this._statusCode = null;
    this._message = message;
    this._details = null;
  }

  get statusCode() {
    throw new Error('Abstract method "statusCode" must be implemented.');
  }

  get message() {
    return this._message;
  }

  get details() {
    return this._details;
  }
}

// Example usage
class CustomApiError extends ApiError {
  constructor(message, statusCode, details) {
    super(message);
    this._statusCode = statusCode;
    this._details = details;
  }

  get statusCode() {
    return this._statusCode;
  }
}

export { ApiError, CustomApiError };
