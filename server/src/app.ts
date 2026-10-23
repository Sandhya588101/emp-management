
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/routes.js";
import employeeRoutes from "./modules/employees/routes.js";
import {
  notFound,
  errorHandler,
} from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Employee Management API is running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
