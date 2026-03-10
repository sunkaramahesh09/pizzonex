const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const pizzaRoutes = require("./routes/pizzas");
const orderRoutes = require("./routes/orders");
const ingredientRoutes = require("./routes/ingredients");
const paymentRoutes = require("./routes/payments");

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:8080",
    "https://pizzonex.vercel.app",
    "https://pizzonex-frontend.vercel.app",
  ],
  credentials: true
}));
app.use(express.json());

// Connect to DB on every request (serverless-safe, uses cached connection)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pizzas", pizzaRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Start server (local dev only)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
