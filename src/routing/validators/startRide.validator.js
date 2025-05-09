import Joi from "joi";
import { BadRequestError } from "../../core/errors/BadRequestError.js";
import { validateSchema } from "../../core/utils/validateSchema.js";

const startRideSchema = Joi.object({
  rideId: Joi.string().required().messages({
    "any.required": "rideId is required for this request!!",
  }),
});

export const validateStartRide = validateSchema(startRideSchema);
