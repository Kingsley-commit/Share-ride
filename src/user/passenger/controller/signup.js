import cloudinary from "../../../core/config/cloudinary.js";
import User from "../../model/user.js";
import Auth from "../../../auth/model/auth.model.js";
import { ConflictError } from "../../../core/errors/conflictError.js";
import { InternalServerError } from "../../../core/errors/internalServerError.js";
import { BadRequestError } from "../../../core/errors/BadRequestError.js";
import { hashPassword } from "../../../core/utils/bcrypt.js";
import { ApiError } from "../../../core/errors/apiErrors.js";
import { sanitizeUser } from "../../../core/utils/sanitize.js";
import { verifyUser } from "../../../core/utils/mailsender.js";
import { jwtSign } from "../../../core/utils/jwt.js";
import { sendEmailVerification } from "../../../core/utils/mailsender.js";
import { generateVerificationToken } from "../../../auth/services/encryptor.js";

export const passengerSignup = async (req, res, next) => {
  const {
    workAddress,
    workEmail,
    email,
    firstName,
    password,
    lastName,
    profession,
    companyName,
    phoneNumber,
  } = req.body;

  try {
    // Validate required fields
    const requiredFields = {
      workAddress,
      workEmail,
      email,
      firstName,
      password,
      profession,
      companyName,
      phoneNumber,
    };

    const workIDFile = req.file;

    if (!workIDFile) {
      return next(new BadRequestError("Work ID file is required"));
    }

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        throw new BadRequestError(`${field} is required`);
      }
    }

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // Upload workID to Cloudinary
    let workIDUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(workIDFile.path, {
        folder: "workIDs",
      });
      workIDUrl = result.secure_url;
    } else {
      throw new BadRequestError("workID image is required");
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    const verificationToken = generateVerificationToken();

    // Create the user
    const user = await User.create({
      type: "passenger",
      workAddress,
      workEmail,
      email,
      workID: workIDUrl,
      firstName,
      password: hashedPassword,
      lastName,
      profession,
      companyName,
      is_verified: false,
      verificationToken,
      phoneNumber,
    });

    Auth.create({
      userId: user.id,
      email,
    });

    await sendEmailVerification(user);

    const token = jwtSign(user.id);

    const sanitizedUser = sanitizeUser(user);

    const passengerDetails = {
      user: sanitizedUser,
    };

    try {
      await verifyUser(passengerDetails, token);
    } catch (error) {
      return next(new InternalServerError("Error sending verification email"));
    }

    res.status(201).json({
      message: "passenger registered successfully",
      user: sanitizedUser,
    });
  } catch (error) {
    next(
      error instanceof ApiError ? error : new InternalServerError(error.message)
    );
  }
};
