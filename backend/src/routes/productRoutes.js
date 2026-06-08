import { Router } from "express";
import {
  getProduct,
  getProducts,
  postProduct,
  putProduct,
  removeProduct
} from "../controllers/productController.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import {
  createProductSchema,
  idParamSchema,
  updateProductSchema,
  validate,
  validateIdParam
} from "../validators/productValidator.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", validateIdParam(idParamSchema), getProduct);

router.post("/", requireAdmin, validate(createProductSchema), postProduct);
router.put(
  "/:id",
  requireAdmin,
  validateIdParam(idParamSchema),
  validate(updateProductSchema),
  putProduct
);
router.delete(
  "/:id",
  requireAdmin,
  validateIdParam(idParamSchema),
  removeProduct
);

export default router;
