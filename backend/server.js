import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";  
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import adminProductRoutes from "./routes/admin/adminProductRoutes.js";
import adminOrderRoutes from "./routes/admin/adminOrderRoutes.js";

const app = express();

// connect database
connectDB();

// middlewares
app.use(cors());
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

// debug route
app.get("/test", (req, res) => {
  res.send("TEST OK");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});