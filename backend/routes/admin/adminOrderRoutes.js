import express from "express";
import Order from "../../models/Orders.js";
import protect from "../../middlewares/authMiddleware.js";
import adminOnly from "../../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, async (_, res) => {
  res.json(await Order.find().populate("user", "name email"));
});

router.put("/:id/status", protect, adminOnly, async (req, res) => {
  const order = await Order.findById(req.params.id);
  order.status = req.body.status;
  await order.save();
  res.json(order);
});

export default router;
