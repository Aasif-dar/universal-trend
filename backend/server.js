import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import adminProductRoutes from "./routes/admin/adminProductRoutes.js";
import adminOrderRoutes from "./routes/admin/adminOrderRoutes.js";

const app = express();

// ✅ connect database
connectDB();

// ✅ CORS FIX (IMPORTANT)
app.use(cors({
  origin: "https://universaltrend.vercel.app", // your frontend URL
  credentials: true
}));

// middlewares
app.use(express.json());
app.use(morgan("dev"));

// static folders
app.use("/uploads", express.static("uploads"));
app.use("/invoices", express.static("invoices"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// admin routes
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// health check route (IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// debug route
app.get("/test", (req, res) => {
  res.send("TEST OK");
});

// ✅ PORT (Render uses this)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});