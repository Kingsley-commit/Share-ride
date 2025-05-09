import Joi from "joi";
import { BadRequestError } from "../../../core/errors/BadRequestError.js";


const getVehicleSchema = Joi.object({
    vehicleId: Joi.string().required().messages({
        "any.required": "Vehicle ID is required",
    }),
});


export const validateGetVehicle = (req, res, next) => {
    const { error } = getVehicleSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessage = error.details
            .map((detail) => detail.message)
            .join(", ");
        return next(new BadRequestError(errorMessage));
    }

    next();
 }