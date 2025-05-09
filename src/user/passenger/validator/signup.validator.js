import Joi from "joi";

import { BadRequestError } from "../../../core/errors/BadRequestError.js";

export const passengerSignupSchema = Joi.object({
  workAddress: Joi.string().required().messages({
    "any.required": "Work address is required",
  }),
  workEmail: Joi.string().email().required().messages({
    "string.email": "Valid work email is required",
    "any.required": "Work email is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Valid email is required",
    "any.required": "Email is required",
  }),
  firstName: Joi.string().required().messages({
    "any.required": "First name is required",
  }),
  password: Joi.string().min(8)
  .max(30)
  .pattern(new RegExp('(?=.*[a-z])'))
  .pattern(new RegExp('(?=.*[A-Z])'))
  .pattern(new RegExp('(?=.*[0-9])'))
  .pattern(new RegExp('(?=.*[!@#$%^&*(),.?":{}|<>])'))
  .required()
  .messages({
    'string.min': 'Password must be at least 8 characters long.',
    'string.max': 'Password must not exceed 30 characters.',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    'string.empty': 'Password is required.',
  }),
  lastName: Joi.string().allow(null, ""),
  phoneNumber: Joi.string().min(11).max(11).regex(/^[0-9]+$/).required().messages({
    "string.min": "Phone number must be 11 characters long",
    "string.max": "Phone number must be 11 characters long",
    "string.pattern.base": "Phone number must contain only numbers",
    "any.required": "phoneNumber is required",
  }),
  profession: Joi.string().required().messages({
    "any.required": "Profession is required",
  }),
  companyName: Joi.string().required().messages({
    "any.required": "Company name is required",
  })
});


export const validateSignup = (req, res, next) => {
  const { error } = passengerSignupSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new BadRequestError(errorMessage));
  }

  next();
};
