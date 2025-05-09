import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Export configuration object
export const config = Object.freeze({
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    name: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    type: process.env.DB_TYPE,
    url: process.env.DATABASE_URL,
  },
  auth: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExpTime: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    refreshTokenExpTime: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
    encryptoSecretKey: process.env.ENCRYPTOR_SECRET_KEY,
  },
  admin: {
    password: process.env.ADMIN_PASSWORD,
    email: process.env.ADMIN_EMAIL,
    userName: process.env.ADMIN_USERNAME,
  },
  mailsender: {
    email: process.env.MAIL_SENDER_EMAIL,
    password: process.env.MAIL_SENDER_PASSWORD,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  mapbox: {
    apiKey: process.env.MAPBOX_API_KEY,
  },
});
