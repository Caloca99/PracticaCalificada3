import { Router } from "express";
import {
  getProduct,
  getProducts,
  postProduct,
  putProduct,
  removeProduct
} from "../controllers/productController.js";
import {
  createProductSchema,
  updateProductSchema,
  validate
} from "../validators/productValidator.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", validate(createProductSchema), postProduct);
router.put("/:id", validate(updateProductSchema), putProduct);
router.delete("/:id", removeProduct);

export default router;
