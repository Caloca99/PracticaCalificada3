import Joi from "joi";

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().lowercase().email({ tlds: false }).max(160).required(),
  password: Joi.string().min(8).max(64).pattern(passwordPattern).required().messages({
    "string.pattern.base":
      "La contrasena debe tener al menos una letra y un numero"
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email({ tlds: false }).required(),
  password: Joi.string().required()
});

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
