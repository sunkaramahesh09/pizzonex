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
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:8080", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pizzas", pizzaRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Start server
const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
