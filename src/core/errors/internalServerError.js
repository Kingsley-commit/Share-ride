import { HttpStatus } from "../utils/statuscodes.js";
import { ApiError } from "./apiErrors.js";

// Define the InternalServerError class
class InternalServerError extends ApiError {
  constructor(message) {
    super(message);
    this._statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    this._message = message;
    this._details = null;

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, InternalServerError.prototype);
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

export { InternalServerError };
