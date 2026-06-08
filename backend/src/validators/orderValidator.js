import Joi from "joi";
import { validate } from "./authValidator.js";

export const checkoutSchema = Joi.object({
  address: Joi.string().trim().min(10).max(200).required(),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9 +()\-]{6,20}$/)
    .required()
    .messages({
      "string.pattern.base":
        "El telefono solo puede contener digitos, espacios, +, ( ) y -"
    })
});

export { validate };
