import { HttpStatus } from "../utils/statuscodes.js";
import { ApiError } from "./apiErrors.js";

// Define the UnAuthorizedError class
class UnAuthorizedError extends ApiError {
  constructor(message, details = null) {
    super(message);
    this._statusCode = HttpStatus.UNAUTHORIZED;
    this._message = message;
    this._details = details;

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }

  get statusCode() {
    return this._statusCode;
  }

  get message() {
    return this._message;
  }

  get details() {
    return this._details;
  }
}

export { UnAuthorizedError };
