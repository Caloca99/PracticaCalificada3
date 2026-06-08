import { Router } from "express";
import { findAllUsers } from "../models/userModel.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/", async (_req, res, next) => {
  try {
    const users = await findAllUsers();
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

export default router;
