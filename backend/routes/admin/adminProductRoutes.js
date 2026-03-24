import express from "express";
import Product from "../../models/Product.js";
import protect from "../../middlewares/authMiddleware.js";
import adminOnly from "../../middlewares/adminMiddleware.js";
import upload from "../../middlewares/upload.js";
import cloudinary from "../../config/cloudinary.js";
import fs from "fs";

const router = express.Router();

/* 🔵 ADD PRODUCT */

router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 5), // must match frontend
  async (req, res) => {
    try {

      const { name, price, type, category, description } = req.body;

      if (!name || !price || !type || !category) {
        return res.status(400).json({
          message: "Name, price, type and category are required"
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Images required" });
      }

      const imageUrls = [];

      // upload each image to cloudinary
      for (const file of req.files) {

        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products"
        });

        imageUrls.push(result.secure_url);

        fs.unlinkSync(file.path);
      }

      const product = await Product.create({
        name,
        price,
        description,
        type,
        category,
        isPopular: req.body.isPopular === "true",
        images: imageUrls
      });

      res.status(201).json(product);

    } catch (error) {

      console.error("ADD PRODUCT ERROR:", error);

      res.status(500).json({
        message: "Server error while adding product",
        error: error.message
      });

    }
  }
);


/* 🔵 ADMIN – GET ALL PRODUCTS */

router.get("/", protect, adminOnly, async (req, res) => {

  try {

    const products = await Product.find().sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});


/* 🔴 DELETE PRODUCT */

router.delete("/:id", protect, adminOnly, async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // remove image from cloudinary
    if (product.image) {

      const publicId = product.image
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

      await cloudinary.uploader.destroy(publicId);

    }

    await product.deleteOne();

    res.json({ message: "Product deleted" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

export default router;