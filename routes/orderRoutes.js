import express from "express";
import Order from "../models/order.js";
const router = express.Router();

// Get all orders
router.get("/", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// Add a new order
router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.status(201).json(newOrder);
});

export default router;
