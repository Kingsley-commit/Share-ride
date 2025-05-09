import { HttpStatus } from "../utils/statuscodes.js";
import { ApiError } from "./apiErrors.js";

// Define the ForbiddenError class
class ForbiddenError extends ApiError {
  constructor(message) {
    super(message);
    this._statusCode = HttpStatus.FORBIDDEN;
    this._message = message;
    this._details = null;

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, ForbiddenError.prototype);
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

export { ForbiddenError };
