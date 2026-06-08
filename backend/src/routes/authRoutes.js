import { Router } from "express";
import { login, logout, me, register } from "../controllers/authController.js";
import { loginSchema, registerSchema, validate } from "../validators/authValidator.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", me);

export default router;
