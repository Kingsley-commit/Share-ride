import Joi from "joi";
import { BadRequestError } from "../../core/errors/BadRequestError.js";
import { validateSchema } from "../../core/utils/validateSchema.js";



const joinRideSchema = Joi.object({
    routeId: Joi.string().required().messages({
        "any.required": "routeId is required for this request!!"
    })
})


export const validateJoinRide =  validateSchema(joinRideSchema);

