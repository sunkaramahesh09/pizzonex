const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pizza", pizzaSchema);
