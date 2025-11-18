import express from "express";
import ChartData from "../models/ChartData.js";

const router = express.Router();

// -------------------
// GET: Fetch chart data by type
// -------------------
router.get("/:type", async (req, res) => {
  const chartType = req.params.type;

  try {
    const chart = await ChartData.findOne({ type: chartType });
    if (!chart) return res.status(404).json({ message: `No data found for type ${chartType}` });
    res.status(200).json(chart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -------------------
// POST: Seed all chart data
// -------------------
router.post("/seed", async (req, res) => {
  try {
    const charts = [
      {
        type: "revenueExpenses",
        data: [
          { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
          { month: 'Feb', revenue: 52000, expenses: 38000, profit: 14000 },
          { month: 'Mar', revenue: 48000, expenses: 35000, profit: 13000 },
          { month: 'Apr', revenue: 61000, expenses: 42000, profit: 19000 },
          { month: 'May', revenue: 55000, expenses: 39000, profit: 16000 },
          { month: 'Jun', revenue: 48000, expenses: 36000, profit: 12000 },
          { month: 'Jul', revenue: 68000, expenses: 45000, profit: 23000 },
          { month: 'Aug', revenue: 72000, expenses: 48000, profit: 24000 },
          { month: 'Sep', revenue: 89000, expenses: 62000, profit: 27000 },
          { month: 'Oct', revenue: 98000, expenses: 68000, profit: 30000 },
          { month: 'Nov', revenue: 34000, expenses: 28000, profit: 6000 },
          { month: 'Dec', revenue: 75000, expenses: 52000, profit: 23000 }
        ]
      },
      {
        type: "salesByCategory",
        data: [
          { name: 'Cement', value: 45, color: '#8B7E74' },
          { name: 'Bricks', value: 30, color: '#E74C3C' },
          { name: 'Sand', value: 15, color: '#D4AF37' },
          { name: 'Iron Rods', value: 10, color: '#7F8C8D' }
        ]
      },
      {
        type: "expenseBreakdown",
        data: [
          { category: 'Raw Materials', value: 48, fill: '#5B8DEE' },
          { category: 'Labour & Salaries', value: 28, fill: '#10B981' },
          { category: 'Transportation & Fuel', value: 12, fill: '#F59E0B' },
          { category: 'Machinery & Maintenance', value: 7, fill: '#8B5CF6' }
        ]
      },
      {
        type: "profitMargin",
        data: [
          { month: 'Jan', margin: 28.9 },
          { month: 'Feb', margin: 26.9 },
          { month: 'Mar', margin: 27.1 },
          { month: 'Apr', margin: 31.1 },
          { month: 'May', margin: 29.1 },
          { month: 'Jun', margin: 25.0 },
          { month: 'Jul', margin: 33.8 },
          { month: 'Aug', margin: 33.3 },
          { month: 'Sep', margin: 30.3 },
          { month: 'Oct', margin: 30.6 },
          { month: 'Nov', margin: 17.6 },
          { month: 'Dec', margin: 30.7 }
        ]
      },
      {
        type: "orderStatus",
        data: [
          { status: 'Completed', value: 45, fill: '#00D4AA' },
          { status: 'Processing', value: 30, fill: '#5B8DEE' },
          { status: 'Pending', value: 18, fill: '#FFA500' },
          { status: 'Cancelled', value: 7, fill: '#E74C3C' }
        ]
      },
      {
        type: "stockLevels",
        data: [
          { material: 'Cement (bags)', current: 850, minimum: 500, max: 1000 },
          { material: 'Bricks (units)', current: 12000, minimum: 8000, max: 15000 },
          { material: 'Sand (tons)', current: 45, minimum: 30, max: 60 },
          { material: 'Iron Rods (kg)', current: 3200, minimum: 2000, max: 5000 }
        ]
      }
    ];

    await ChartData.deleteMany();        // clear old data
    await ChartData.insertMany(charts);  // insert new data

    res.status(200).json({ message: "All chart data seeded successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to seed chart data", error });
  }
});

export default router;
