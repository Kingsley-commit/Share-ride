import { logger } from "../loggers/logger.js";

export const gracefullyShutdown = async (error) => {
  logger.error("UNEXPECTED_APP_ERROR", error);
  process.exit(1);
};
