const Ingredient = require("../models/Ingredient");

// GET /api/ingredients
exports.getAll = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ type: 1, name: 1 });
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/ingredients (admin)
exports.create = async (req, res) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    res.status(201).json(ingredient);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/ingredients/:id (admin)
exports.update = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!ingredient) return res.status(404).json({ message: "Ingredient not found" });
    res.json(ingredient);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
