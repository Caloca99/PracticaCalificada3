import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sessionMiddleware } from "./config/session.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(sessionMiddleware);

app.get("/", (_req, res) => {
  res.json({
    message: "CALOCA GYM API with Express, MySQL and external product images",
    products: "/api/products",
    auth: "/api/auth",
    cart: "/api/cart",
    orders: "/api/orders"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
