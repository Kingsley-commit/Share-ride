import cors from "cors";

// Define allowed origins, methods, and headers
const allowedOrigins = [
  "http://localhost:3000",
  "http://console.localhost:3000",
  "https://ridepal.vercel.app",
];

const allowedMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];

const allowedHeaders = ["Content-Type", "Authorization"];

// Define CORS options
export const corsOptions = {
  methods: allowedMethods,
  allowedHeaders: allowedHeaders,
  origin: allowedOrigins,
  credentials: true,
};
