import express from "express";
import OrderManagement from "../models/OrderManagement.js";
import Material from "../models/Material.js";

const router = express.Router();

// Helper function to update inventory
const updateInventory = async (pair, quantity, action) => {
  try {
    // Extract material name from pair (e.g., "Cement/USDT" -> "Cement")
    const materialName = pair.split('/')[0];

    console.log(`Looking for material: ${materialName}`);
    const material = await Material.findOne({ name: materialName });
    if (!material) {
      console.log(`Material ${materialName} not found in inventory`);
      return;
    }

    console.log(`Found material: ${material.name}, current quantity: ${material.quantity}`);

    if (action === "increase") {
      material.quantity += quantity;
      console.log(`Increasing quantity by ${quantity}, new quantity: ${material.quantity}`);
    } else if (action === "decrease") {
      material.quantity = Math.max(0, material.quantity - quantity);
      console.log(`Decreasing quantity by ${quantity}, new quantity: ${material.quantity}`);
    }

    material.lastUpdated = new Date().toISOString();
    await material.save();
    console.log(`Inventory updated successfully: ${materialName} ${action}d by ${quantity}`);
  } catch (err) {
    console.error("Error updating inventory:", err);
  }
};

// ✅ GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await OrderManagement.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET orders by type (mine/customers)
router.get("/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const orders = await OrderManagement.find({ type }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET single order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await OrderManagement.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ CREATE new order
router.post("/", async (req, res) => {
  try {
    const { id, type, client, pair, side, quantity, price, status } = req.body;

    if (!id || !type || !pair || !side || !quantity || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = new OrderManagement({
      id,
      type,
      client: client || "N/A",
      pair,
      side,
      quantity,
      price,
      status: status || "open",
    });

    const savedOrder = await order.save();

    // Update inventory based on order type and side
    if (type === "mine" && side === "Buy") {
      // My orders - Buy: Increase inventory
      await updateInventory(pair, quantity, "increase");
    } else if (type === "customers" && side === "Sell") {
      // Customer orders - Sell: Decrease inventory
      await updateInventory(pair, quantity, "decrease");
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE order status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await OrderManagement.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE order
router.delete("/:id", async (req, res) => {
  try {
    const order = await OrderManagement.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ BULK CREATE orders (for seeding)
router.post("/bulk/seed", async (req, res) => {
  try {
    const orders = req.body;
    const savedOrders = await OrderManagement.insertMany(orders);
    res.status(201).json({
      message: `${savedOrders.length} orders created successfully`,
      data: savedOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;