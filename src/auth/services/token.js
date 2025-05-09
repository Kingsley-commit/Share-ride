import jwt from "jsonwebtoken";
import { config } from "../../core/config/env.js";
import { encrypt, decrypt } from "../../auth/services/encryptor.js";
import { logger } from "../../core/loggers/logger.js";
import { UnAuthorizedError } from "../../core/errors/unAuthorizedError.js";
import { AppMessages } from "../../core/common/appmessages.js";

// Function to generate a JWT token
const generateToken = ({ data, secret, expiresIn }) => {
  return jwt.sign(data, secret, { expiresIn });
};

// Function to verify a JWT token
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.error("token expired");
      throw new UnAuthorizedError(AppMessages.FAILURE.TOKEN_EXPIRED);
    } else {
      logger.error(error);
      throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED);
    }
  }
};

// Function to generate access and refresh tokens
const getTokens = async (data) => {
  return await Promise.all([
    generateAccessToken(data),
    generateRefreshToken(data),
  ]);
};

// Function to generate an access token
const generateAccessToken = (data) => {
  const { accessTokenExpTime, accessTokenSecret } = config.auth;
  const accessToken = generateToken({
    data,
    secret: accessTokenSecret,
    expiresIn: accessTokenExpTime,
  });
  return encrypt(accessToken);
};

// Function to generate a refresh token
const generateRefreshToken = (data) => {
  const { refreshTokenExpTime, refreshTokenSecret } = config.auth;
  const refreshToken = generateToken({
    data,
    secret: refreshTokenSecret,
    expiresIn: refreshTokenExpTime,
  });
  return encrypt(refreshToken);
};

// Function to extract token details
const extractTokenDetails = async (encryptedToken, secret) => {
  const token = decrypt(encryptedToken);
  const tokenDetails = verifyToken(token, secret);
  return tokenDetails;
};



// Export functions
export { getTokens, extractTokenDetails };
