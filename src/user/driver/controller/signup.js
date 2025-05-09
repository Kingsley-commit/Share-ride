import cloudinary from "../../../core/config/cloudinary.js";
import User from "../../model/user.js";
import Vehicle from "../../model/vehicle.js";
import Auth from "../../../auth/model/auth.model.js";
import { hashPassword } from "../../../core/utils/bcrypt.js";
import { ApiError } from "../../../core/errors/apiErrors.js";
import { sanitizeUser } from "../../../core/utils/sanitize.js";
import { verifyUser } from "../../../core/utils/mailsender.js";
import { InternalServerError } from "../../../core/errors/internalServerError.js";
import { ConflictError } from "../../../core/errors/conflictError.js";
import { BadRequestError } from "../../../core/errors/BadRequestError.js";
import { jwtSign } from "../../../core/utils/jwt.js";
import { generateVerificationToken } from "../../../auth/services/encryptor.js";
import { sendEmailVerification } from "../../../core/utils/mailsender.js";
// import { VehicleService } from "../services/vehicle.service.js";

export const signUpDriver = async (req, res, next) => {
  const {
    workAddress,
    workEmail,
    email,
    firstName,
    password,
    lastName,
    profession,
    companyName,
    plateNumber,
    color,
    model,
    seatNumber,
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
      plateNumber,
      color,
      model,
      seatNumber,
      phoneNumber,
    };

    const workIDFile = req.file;

    // Validate file upload
    if (!workIDFile) {
      return next(new BadRequestError("Work ID file is required"));
    }

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return next(new BadRequestError(`${field} is required`));
      }
    }

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new ConflictError("User with this email already exists"));
    }

    // Check if a vehicle with the given plate number already exists
    const existingVehicle = await Vehicle.findOne({ where: { plateNumber } });
    if (existingVehicle) {
      return next(
        new ConflictError("Vehicle with this plate number already exists")
      );
    }

    // Upload workID to Cloudinary
    let workIDUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(workIDFile.path, {
        folder: "workIDs",
      });
      workIDUrl = result.secure_url;
    } else {
      return next(new BadRequestError("workID image is required"));
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    const verificationToken = generateVerificationToken();

    // Create the user
    const user = await User.create({
      type: "driver",
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
      phoneNumber
    });

    // Create the vehicle
    const vehicle = await Vehicle.create({
      plateNumber,
      color,
      model,
      seatNumber,
      ownerId: user.id,
    });

    // const vehicle = await VehicleService.createVehicle()

    await Auth.create({
      userId: user.id,
      email,
    });

    await sendEmailVerification(user);

    const token = jwtSign(user.id);

    const sanitizedUser = sanitizeUser(user);

    const driverDetails = {
      user: sanitizedUser,
      vehicle,
    };

    try {
      await verifyUser(driverDetails, token);
    } catch (error) {
      return next(new InternalServerError(error.message));
    }

    res
      .status(201)
      .json({
        message: "Driver registered successfully",
        user: sanitizedUser,
        vehicle,
      });
  } catch (error) {
    next(
      error instanceof ApiError ? error : new InternalServerError(error.message)
    );
  }
};
