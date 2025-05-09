import { startApp } from "./app/app.module.js";
import { gracefullyShutdown } from "./core/utils/shutdowngracefully.js";
import { initializeDbConnection } from "./core/utils/database.connection.js";
import { logger } from "./core/loggers/logger.js";
import { config } from "./core/config/env.js";



initializeDbConnection().then(startApp).catch(gracefullyShutdown);

// Process-wide error handling for uncaught exceptions
process.on("uncaughtException", (error) => {
    logger.info("Uncaught exception", error) // Log the uncaught exception details
    process.exit(1) // Exit the process with a status code of 1 indicating failure
})



// Process-wide error handling for unhandled promise rejections
process.on("unhandledRejection", (error) => {
    logger.info("Unhandled rejection", error) // Log the unhandled promise rejection details
    process.exit(1) // Exit the process
})
