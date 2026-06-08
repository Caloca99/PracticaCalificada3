import { Router } from "express";
import { checkout, listOrders, myOrders } from "../controllers/orderController.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { checkoutSchema, validate } from "../validators/orderValidator.js";

const router = Router();

router.use(requireAuth);

router.post("/checkout", validate(checkoutSchema), checkout);
router.get("/mine", myOrders);
router.get("/", requireAdmin, listOrders);

export default router;
