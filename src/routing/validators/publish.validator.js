
import Joi from "joi";
import { BadRequestError } from "../../core/errors/BadRequestError.js";
import { validateSchema } from "../../core/utils/validateSchema.js";

const rideSchema = Joi.object({

  startPoint: Joi.string().required().messages({
    "any.required": "Start point is required",
  }),
  destination: Joi.string().required().messages({
    "any.required": "Destination is required",
  }),
  routes: Joi.array().items(Joi.string()).required().messages({
    "any.required": "Routes is required",
  }),
  vehicleId: Joi.string().required().messages({
    "any.required": "please provide the vehicle id for this ride."
  }),
  seatAvailable: Joi.number().required().messages({
    "any.required": "please from provide the number of  seat available for this ride."
  }),
  instruction: Joi.string().required().messages({
    "any.required": "please provide the instruction for this ride."
  }),

});

export const validateRide = validateSchema(rideSchema);

