import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { appRouter } from "./app.router.js";
import { corsOptions } from "../core/config/cors.js";
import { errorHandler } from "../core/middlewares/errorhandler.js";
import { notFoundErrorHandler } from "../core/middlewares/notFoundErrorHandler.js";

export const app = express();

// Use the built-in middleware to parse JSON bodies. This allows you to handle JSON payloads.
app.use(express.json());

// Use cookie-parser middleware to parse cookies attached to the client request object.
app.use(cookieParser());


// Enable Cross-Origin Resource Sharing (CORS) with predefined options.
app.use(cors(corsOptions));


// Use middleware to parse URL-encoded bodies with the querystring library.
// 'extended: false' opts to use the classic encoding.
app.use(express.urlencoded({ extended: false }));

// Mount the API routes under '/api/v1'. All routes inside appRouter will be prefixed with '/api/v1'.
app.use("/api", appRouter);

app.set("trust proxy", true);

// Use a custom middleware for handling 404 errors when no other route matches.
app.use(notFoundErrorHandler.handle);

// Use a custom error handling middleware to manage responses on API errors.
// This captures any errors thrown in the application and formats them before sending to the user.
app.use(errorHandler.handle);
