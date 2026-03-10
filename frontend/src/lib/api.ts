const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  // Auth
  register: (body: { name: string; email: string; password: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  verifyEmail: (token: string) =>
    request(`/auth/verify-email/${token}`),

  forgotPassword: (email: string) =>
    request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),

  resetPassword: (token: string, password: string) =>
    request(`/auth/reset-password/${token}`, { method: "POST", body: JSON.stringify({ password }) }),

  getMe: () => request("/auth/me"),

  // Pizzas
  getPizzas: () => request("/pizzas"),
  createPizza: (body: any) =>
    request("/pizzas", { method: "POST", body: JSON.stringify(body) }),
  updatePizza: (id: string, body: any) =>
    request(`/pizzas/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deletePizza: (id: string) =>
    request(`/pizzas/${id}`, { method: "DELETE" }),

  // Orders
  createOrder: (body: { items: any[]; total: number }) =>
    request("/orders", { method: "POST", body: JSON.stringify(body) }),
  getMyOrders: () => request("/orders/my"),
  getAllOrders: () => request("/orders"),
  updateOrderStatus: (id: string, orderStatus: string) =>
    request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ orderStatus }) }),

  // Ingredients
  getIngredients: () => request("/ingredients"),
  createIngredient: (body: any) =>
    request("/ingredients", { method: "POST", body: JSON.stringify(body) }),
  updateIngredient: (id: string, body: any) =>
    request(`/ingredients/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

  // Payments
  createPaymentOrder: (body: { amount: number; orderId: string }) =>
    request("/payments/create-order", { method: "POST", body: JSON.stringify(body) }),
  verifyPayment: (body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;
  }) => request("/payments/verify", { method: "POST", body: JSON.stringify(body) }),
};
