require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Pizza = require("./models/Pizza");
const Ingredient = require("./models/Ingredient");

const pizzas = [
  { name: "Margherita", description: "Fresh mozzarella, tomato sauce, and basil on a crispy thin crust", price: 299, image: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1773162067/pizzonex/pizza-bbq-chicken.jpg", category: "Classic" },
  { name: "BBQ Chicken", description: "Smoky BBQ sauce, grilled chicken, caramelized onions, and cilantro", price: 449, image: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1773160090/pizzonex/pizza-bbq.jpg", category: "Premium" },
  { name: "Veggie Supreme", description: "Loaded with bell peppers, mushrooms, olives, onions, and fresh basil", price: 349, image: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1773162082/pizzonex/pizza-classic-pepperoni.jpg", category: "Vegetarian" },
  { name: "Meat Lovers", description: "Pepperoni, sausage, bacon, ham – a carnivore's dream pizza", price: 499, image: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1773162093/pizzonex/pizza-farmhouse.jpg", category: "Premium" },
  { name: "Classic Pepperoni", description: "Generous pepperoni with mozzarella and our signature tomato sauce", price: 349, image: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1773160082/pizzonex/pizza-margherita.jpg", category: "Classic" },
  { name: "Garden Fresh", description: "Seasonal vegetables with herb-infused olive oil and feta cheese", price: 329, image: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1773160105/pizzonex/pizza-meat.jpg", category: "Vegetarian" },
  { name: "Pesto Chicken", description: "Creamy pesto base, grilled chicken, sun-dried tomatoes, and parmesan", price: 429, image: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1773162053/pizzonex/pizza-paneer-tikka.png", category: "Premium" },
  { name: "Hawaiian", description: "Classic ham and pineapple with mozzarella on a golden crust", price: 379, image: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1773160338/pizzonex/pizza-pepperoni.jpg", category: "Classic" },
  { name: "Paneer Tikka", description: "Spiced paneer chunks, onions, peppers, and tangy tikka sauce", price: 399, image: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1773160435/pizzonex/pizza-pesto-chicken.jpg", category: "Vegetarian" },
  { name: "Farmhouse", description: "Mushrooms, capsicum, onions, and fresh tomatoes on a wheat crust", price: 319, image: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1773162106/pizzonex/pizza-veggie-supreme.jpg", category: "Vegetarian" },
  { name: "Chicken Keema", description: "Spiced minced chicken, jalapeños, and onions with a fiery kick", price: 469, image: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1773160100/pizzonex/pizza-veggie.jpg", category: "Premium" },
  { name: "Four Cheese", description: "Mozzarella, cheddar, parmesan, and gouda on a stuffed crust", price: 449, image: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1773160338/pizzonex/pizza-pepperoni.jpg", category: "Classic" },
];

const ingredients = [
  { name: "Thin Crust", type: "Base", stock: 50, threshold: 10 },
  { name: "Thick Crust", type: "Base", stock: 40, threshold: 10 },
  { name: "Stuffed Crust", type: "Base", stock: 8, threshold: 10 },
  { name: "Whole Wheat", type: "Base", stock: 30, threshold: 10 },
  { name: "Gluten Free", type: "Base", stock: 15, threshold: 10 },
  { name: "Marinara", type: "Sauce", stock: 60, threshold: 15 },
  { name: "BBQ Sauce", type: "Sauce", stock: 45, threshold: 15 },
  { name: "Alfredo", type: "Sauce", stock: 35, threshold: 15 },
  { name: "Pesto", type: "Sauce", stock: 5, threshold: 15 },
  { name: "Buffalo", type: "Sauce", stock: 25, threshold: 15 },
  { name: "Mozzarella", type: "Cheese", stock: 70, threshold: 20 },
  { name: "Cheddar", type: "Cheese", stock: 55, threshold: 20 },
  { name: "Parmesan", type: "Cheese", stock: 40, threshold: 20 },
  { name: "Bell Peppers", type: "Veggie", stock: 45, threshold: 10 },
  { name: "Mushrooms", type: "Veggie", stock: 3, threshold: 10 },
  { name: "Olives", type: "Veggie", stock: 50, threshold: 10 },
  { name: "Onions", type: "Veggie", stock: 60, threshold: 10 },
  { name: "Pepperoni", type: "Meat", stock: 40, threshold: 15 },
  { name: "Chicken", type: "Meat", stock: 35, threshold: 15 },
  { name: "Bacon", type: "Meat", stock: 7, threshold: 15 },
];

async function seed() {
  await connectDB();

  // Clear existing data
  await Pizza.deleteMany({});
  await Ingredient.deleteMany({});

  // Seed pizzas and ingredients
  await Pizza.insertMany(pizzas);
  console.log(`✅ Seeded ${pizzas.length} pizzas`);

  await Ingredient.insertMany(ingredients);
  console.log(`✅ Seeded ${ingredients.length} ingredients`);

  // Create admin user if not exists
  const existingAdmin = await User.findOne({ email: "admin@pizza.com" });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    await User.create({
      name: "Admin",
      email: "admin@pizza.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });
    console.log("✅ Created admin user (admin@pizza.com / admin123)");
  } else {
    console.log("ℹ️  Admin user already exists");
  }

  console.log("\n🎉 Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
