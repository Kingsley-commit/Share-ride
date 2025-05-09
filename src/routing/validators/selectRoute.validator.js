import Joi from "joi";

export const selectRouteSchema = Joi.object({
  source: Joi.string().required().messages({
    "any.required": "source is required for this request!!",
  }),
    destination: Joi.string().required().messages({
        "any.required": "destination is required for this request!!",
    })
});

// export const validateSelectRoute = async (req, res, next) => {
//   const { error } = selectRouteSchema.validate(req.body, { abortEarly: false });

//   if (error) {
//     const errorMassage = error.details
//       .map((details) => details.message)
//       .join(",");

//     return next(new BadRequestError(errorMassage));
//   }

//   next();
// };
