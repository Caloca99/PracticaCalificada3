import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().min(5).required(),
  price: Joi.number().precision(2).positive().required(),
  stock: Joi.number().integer().min(0).required(),
  image_url: Joi.string().trim().uri().allow("")
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  description: Joi.string().trim().min(5),
  price: Joi.number().precision(2).positive(),
  stock: Joi.number().integer().min(0),
  image_url: Joi.string().uri()
}).min(1);

export function validate(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const validationError = new Error("Validation error");
      validationError.statusCode = 400;
      validationError.details = error.details.map((detail) => detail.message);
      return next(validationError);
    }

    req.body = value;
    next();
  };
}
