import { HttpStatus } from "../utils/statuscodes.js";
import { ApiError } from "./apiErrors.js";

// Define the ConflictError class
class ConflictError extends ApiError {
  constructor(message) {
    super(message);
    this._statusCode = HttpStatus.CONFLICT;
    this._message = message;
    this._details = null;

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, ConflictError.prototype);
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

export { ConflictError };
