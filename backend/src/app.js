import express from "express";
import cors from "cors";
import morgan from "morgan";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || "*";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({
    message: "CALOCA GYM API with Express, MySQL and external product images",
    products: "/api/products"
  });
});

app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
