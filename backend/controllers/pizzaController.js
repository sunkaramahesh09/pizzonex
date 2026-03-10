const Pizza = require("../models/Pizza");

// GET /api/pizzas
exports.getAll = async (req, res) => {
  try {
    const pizzas = await Pizza.find().sort({ createdAt: -1 });
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/pizzas (admin)
exports.create = async (req, res) => {
  try {
    const pizza = await Pizza.create(req.body);
    res.status(201).json(pizza);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/pizzas/:id (admin)
exports.update = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pizza) return res.status(404).json({ message: "Pizza not found" });
    res.json(pizza);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/pizzas/:id (admin)
exports.remove = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) return res.status(404).json({ message: "Pizza not found" });
    res.json({ message: "Pizza deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
