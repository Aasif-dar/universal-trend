
import express from "express";
import Order from "../models/Orders.js";
import User from "../models/User.js";
import protect from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";
import { sendEmail } from "../utils/notify.js";
import { generateInvoice } from "../utils/genrateInvoice.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    const {
      items,
      subtotal,
      total,
      address,
      phone,
      state,
      paymentMethod,
      deliveryCharge,
    } = req.body;

    if (!items || !address || !phone) {
      return res.status(400).json({
        message: "Missing order details",
      });
    }

    const order = await Order.create({
      user: user._id,
      items,
      subtotal,
      total,
      address,
      phone,
      state,
      paymentMethod,
      deliveryCharge,
    });

    const populatedOrder = await order.populate("user");

    // 🔥 Generate Invoice
   const invoicePath = generateInvoice(populatedOrder);

// upload to cloudinary
    const upload = await cloudinary.uploader.upload(invoicePath, {
    resource_type: "raw",
    folder: "invoices",
    });

    order.invoiceUrl = upload.secure_url; 

    await order.save();

// optional: delete local file
    fs.unlinkSync(invoicePath);

    const fullOrder = { ...order._doc, user };

    // Send Email
    // await sendEmail(fullOrder);

    res.status(201).json(order);

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: "Order failed" });
  }
});
// 🔵 USER ORDER HISTORY
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user }).sort({ createdAt: -1 });
  res.json(orders);
});

// 🔴 ADMIN – ALL ORDERS
router.get("/allorders", protect, adminOnly, async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
});
// UPDATE STATUS (ADMIN)
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  const order = await Order.findById(req.params.id);
  order.status = req.body.status;
  await order.save();
  res.json(order);
});


router.get("/:id", protect, async (req, res) => {

  const order = await Order.findById(req.params.id);

  res.json(order);

});
export default router;
