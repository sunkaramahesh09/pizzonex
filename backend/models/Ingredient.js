const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Base", "Sauce", "Cheese", "Veggie", "Meat"],
      required: true,
    },
    stock: { type: Number, required: true, default: 0 },
    threshold: { type: Number, required: true, default: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ingredient", ingredientSchema);
