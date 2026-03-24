import express from "express";
import Order from "../models/Orders.js";
import User from "../models/User.js";
import protect from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";
import { sendWhatsApp, sendEmail } from "../utils/notify.js";

const router = express.Router();

// CREATE ORDER (USER)
router.post("/", protect, async (req, res) => {
  const user = await User.findById(req.user);

  const order = await Order.create({
    user: user._id,
    items: req.body.items,
    total: req.body.total,
  });

  const fullOrder = { ...order._doc, user };

  await sendWhatsApp(fullOrder);
  await sendEmail(fullOrder);

  res.json(order);
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


export default router;
