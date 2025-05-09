import { RouteNotFoundError } from "../errors/notFoundError.js";

export class NotFoundErrorHandler {
  handle = (req, res, next) => {
    next(
      new RouteNotFoundError(
        `request path "${req.path}" not found for ${req.method} method.`
      )
    );
  };
}


export const notFoundErrorHandler = new NotFoundErrorHandler();