import express from "express";
import Product from "../models/Product.js";
import protect from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";
import upload from "../middleware/upload.js";
const router = express.Router();

// 🔵 ALL PRODUCTS
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// 🔥 POPULAR PRODUCTS (HOME PAGE)
router.get("/popular", async (req, res) => {
  const products = await Product.find({ isPopular: true });
  res.json(products);
});

// 🟢 ADD PRODUCT (ADMIN)
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      type: req.body.type,
      isPopular: req.body.isPopular === "true",
      image: `/uploads/${req.file.filename}`,
    });

    res.json(product);
  }
);


// ❌ DELETE PRODUCT (ADMIN ONLY)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.deleteOne();
  res.json({ message: "Product deleted successfully" });
});

export default router;
