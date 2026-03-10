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

export const builderOptions = {
  bases: ["Thin Crust", "Thick Crust", "Stuffed Crust", "Whole Wheat", "Gluten Free"],
  sauces: ["Marinara", "BBQ Sauce", "Alfredo", "Pesto", "Buffalo"],
  cheeses: ["Mozzarella", "Cheddar", "Parmesan"],
  veggies: ["Bell Peppers", "Mushrooms", "Olives", "Onions", "Jalapenos", "Spinach", "Tomatoes"],
  meats: ["Pepperoni", "Chicken", "Bacon", "Sausage", "Ham"],
};
