import { Router } from "express";
import {
  addItem,
  deleteItem,
  emptyCart,
  getCart,
  updateItem
} from "../controllers/cartController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  addItemSchema,
  itemIdParamSchema,
  updateItemSchema,
  validate
} from "../validators/cartValidator.js";
import { validateIdParam } from "../validators/productValidator.js";

const router = Router();

router.use(requireAuth);

router.get("/", getCart);
router.post("/items", validate(addItemSchema), addItem);
router.put(
  "/items/:id",
  validateIdParam(itemIdParamSchema),
  validate(updateItemSchema),
  updateItem
);
router.delete("/items/:id", validateIdParam(itemIdParamSchema), deleteItem);
router.delete("/", emptyCart);

export default router;
