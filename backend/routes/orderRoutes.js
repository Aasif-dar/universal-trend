import express from "express";
import Order from "../models/Orders.js";
import User from "../models/User.js";
import protect from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";

import {
  sendOrderEmail,
} from "../utils/sendEmail.js";

const router = express.Router();

/* =========================================================
   CREATE ORDER
========================================================= */

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

    /* =========================================================
       FORMAT ITEMS
    ========================================================= */

    const formattedItems = items.map((item) => ({
      productId:
        item.productId ||
        item._id ||
        item.id,

      name: item.name,

      price: item.price,

      quantity: item.quantity,

      size: item.size,

      image:
        item.image ||
        item.images?.[0],
    }));

    /* =========================================================
       CREATE ORDER
    ========================================================= */

    const order = await Order.create({
      user: user._id,

      items: formattedItems,

      subtotal,

      total,

      address,

      phone,

      state,

      paymentMethod,

      deliveryCharge,
    });

    /* =========================================================
       SEND EMAIL TO ADMIN
    ========================================================= */

    await sendOrderEmail({
      customerName: user.name,

      customerEmail: user.email,

      phone,

      total,

      address,

      paymentMethod,

      items: formattedItems,
    });

    /* =========================================================
       RESPONSE
    ========================================================= */

    res.status(201).json(order);

  } catch (err) {

    console.error("ORDER ERROR:", err);

    res.status(500).json({
      message: "Order failed",
    });
  }
});

/* =========================================================
   USER ORDERS
========================================================= */

router.get("/my", protect, async (req, res) => {

  const orders = await Order.find({
    user: req.user,
  }).sort({
    createdAt: -1,
  });

  res.json(orders);
});

/* =========================================================
   ADMIN ALL ORDERS
========================================================= */

router.get(
  "/allorders",
  protect,
  adminOnly,

  async (req, res) => {

    const orders = await Order.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    res.json(orders);
  }
);

/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

router.put(
  "/:id/status",
  protect,
  adminOnly,

  async (req, res) => {

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status =
      req.body.status || order.status;

    await order.save();

    res.json(order);
  }
);

/* =========================================================
   GET SINGLE ORDER
========================================================= */

router.get("/:id", protect, async (req, res) => {

  const order = await Order.findById(
    req.params.id
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  res.json(order);
});

export default router;