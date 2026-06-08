import Joi from "joi";
import { validate } from "./authValidator.js";

export const addItemSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).max(999).default(1)
});

export const updateItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).max(999).required()
});

export const itemIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

export { validate };
