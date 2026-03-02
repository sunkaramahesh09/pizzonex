import pizzaMargherita from "@/assets/pizza-margherita.png";
import pizzaBbq from "@/assets/pizza-bbq.png";
import pizzaVeggie from "@/assets/pizza-veggie.png";
import pizzaMeat from "@/assets/pizza-meat.png";
import heroPizza from "@/assets/hero-pizza.png";

export { heroPizza };

export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  pizza: Pizza;
  quantity: number;
  customizations?: string[];
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  paymentStatus: "Paid" | "Pending" | "Failed";
  orderStatus: "Order Received" | "In Kitchen" | "Sent to Delivery" | "Delivered";
}

export interface Ingredient {
  id: string;
  name: string;
  type: "Base" | "Sauce" | "Cheese" | "Veggie" | "Meat";
  stock: number;
  threshold: number;
}

export const pizzas: Pizza[] = [
  { id: "1", name: "Margherita", description: "Fresh mozzarella, tomato sauce, and basil on a crispy thin crust", price: 299, image: pizzaMargherita, category: "Classic" },
  { id: "2", name: "BBQ Chicken", description: "Smoky BBQ sauce, grilled chicken, caramelized onions, and cilantro", price: 449, image: pizzaBbq, category: "Premium" },
  { id: "3", name: "Veggie Supreme", description: "Loaded with bell peppers, mushrooms, olives, onions, and fresh basil", price: 349, image: pizzaVeggie, category: "Vegetarian" },
  { id: "4", name: "Meat Lovers", description: "Pepperoni, sausage, bacon, ham – a carnivore's dream pizza", price: 499, image: pizzaMeat, category: "Premium" },
  { id: "5", name: "Classic Pepperoni", description: "Generous pepperoni with mozzarella and our signature tomato sauce", price: 349, image: pizzaMeat, category: "Classic" },
  { id: "6", name: "Garden Fresh", description: "Seasonal vegetables with herb-infused olive oil and feta cheese", price: 329, image: pizzaVeggie, category: "Vegetarian" },
];

export const mockOrders: Order[] = [
  { id: "ORD-001", date: "2026-03-01", items: [], total: 748, paymentStatus: "Paid", orderStatus: "Delivered" },
  { id: "ORD-002", date: "2026-03-02", items: [], total: 449, paymentStatus: "Paid", orderStatus: "In Kitchen" },
  { id: "ORD-003", date: "2026-03-02", items: [], total: 998, paymentStatus: "Pending", orderStatus: "Order Received" },
];

export const mockIngredients: Ingredient[] = [
  { id: "1", name: "Thin Crust", type: "Base", stock: 50, threshold: 10 },
  { id: "2", name: "Thick Crust", type: "Base", stock: 40, threshold: 10 },
  { id: "3", name: "Stuffed Crust", type: "Base", stock: 8, threshold: 10 },
  { id: "4", name: "Whole Wheat", type: "Base", stock: 30, threshold: 10 },
  { id: "5", name: "Gluten Free", type: "Base", stock: 15, threshold: 10 },
  { id: "6", name: "Marinara", type: "Sauce", stock: 60, threshold: 15 },
  { id: "7", name: "BBQ Sauce", type: "Sauce", stock: 45, threshold: 15 },
  { id: "8", name: "Alfredo", type: "Sauce", stock: 35, threshold: 15 },
  { id: "9", name: "Pesto", type: "Sauce", stock: 5, threshold: 15 },
  { id: "10", name: "Buffalo", type: "Sauce", stock: 25, threshold: 15 },
  { id: "11", name: "Mozzarella", type: "Cheese", stock: 70, threshold: 20 },
  { id: "12", name: "Cheddar", type: "Cheese", stock: 55, threshold: 20 },
  { id: "13", name: "Parmesan", type: "Cheese", stock: 40, threshold: 20 },
  { id: "14", name: "Bell Peppers", type: "Veggie", stock: 45, threshold: 10 },
  { id: "15", name: "Mushrooms", type: "Veggie", stock: 3, threshold: 10 },
  { id: "16", name: "Olives", type: "Veggie", stock: 50, threshold: 10 },
  { id: "17", name: "Onions", type: "Veggie", stock: 60, threshold: 10 },
  { id: "18", name: "Pepperoni", type: "Meat", stock: 40, threshold: 15 },
  { id: "19", name: "Chicken", type: "Meat", stock: 35, threshold: 15 },
  { id: "20", name: "Bacon", type: "Meat", stock: 7, threshold: 15 },
];

export const builderOptions = {
  bases: ["Thin Crust", "Thick Crust", "Stuffed Crust", "Whole Wheat", "Gluten Free"],
  sauces: ["Marinara", "BBQ Sauce", "Alfredo", "Pesto", "Buffalo"],
  cheeses: ["Mozzarella", "Cheddar", "Parmesan"],
  veggies: ["Bell Peppers", "Mushrooms", "Olives", "Onions", "Jalapeños", "Spinach", "Tomatoes"],
  meats: ["Pepperoni", "Chicken", "Bacon", "Sausage", "Ham"],
};
