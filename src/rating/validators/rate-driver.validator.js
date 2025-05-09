import Joi from "joi";
import { validateSchema } from "../../core/utils/validateSchema.js";

const rateDriverSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required().messages({
    "number.base": "rating must be a number!!",
    "number.min": "rating must be at least 1!!",
    "number.max": "rating must be at most 5!!",
    "any.required": "rating is required for this request!!",
  }),
  rideId: Joi.string().required().messages({
    "any.required": "rideId is required for this request!!",
  }),
});

export const validateRateDriver = validateSchema(rateDriverSchema);
