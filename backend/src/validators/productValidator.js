import Joi from "joi";
import { validate } from "./authValidator.js";

const namePattern = /^[\p{L}0-9\s\-_.,()&áéíóúñüÁÉÍÓÚÑÜ]+$/u;

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).pattern(namePattern).required().messages({
    "string.pattern.base": "El nombre contiene caracteres no permitidos"
  }),
  description: Joi.string().trim().min(5).required(),
  price: Joi.number().precision(2).positive().max(999999.99).required(),
  stock: Joi.number().integer().min(0).max(100000).required(),
  image_url: Joi.string().trim().uri().allow("")
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).pattern(namePattern).messages({
    "string.pattern.base": "El nombre contiene caracteres no permitidos"
  }),
  description: Joi.string().trim().min(5),
  price: Joi.number().precision(2).positive().max(999999.99),
  stock: Joi.number().integer().min(0).max(100000),
  image_url: Joi.string().uri()
}).min(1);

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

export function validateIdParam(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const validationError = new Error("Validation error");
      validationError.statusCode = 400;
      validationError.details = error.details.map((detail) => detail.message);
      return next(validationError);
    }

    req.params = value;
    next();
  };
}

export { validate };
