import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

/* GET ALL PRODUCTS */
router.get("/", async (req, res) => {
  try {

    const { type, category } = req.query;

    const query = {};

    if (type) query.type = type;
    if (category && category !== "All") query.category = category;

    const products = await Product.find(query);

    res.json(products);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
});

/* GET POPULAR PRODUCTS */
router.get("/popular", async (req, res) => {

  try {

    const products = await Product.find({ isPopular: true });

    res.json(products);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
});

/* GET PRODUCT BY ID */
router.get("/:id", async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

export default router;