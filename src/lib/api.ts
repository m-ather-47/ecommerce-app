import type {
  CartResponse,
  CheckoutResponse,
  OrdersResponse,
  OrderResponse,
  UserResponse,
} from "@/lib/types";

class ApiClientError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new ApiClientError(body.error, res.status);
  }
  return res.json();
}

// Cart
export const getCart = () => apiFetch<CartResponse>("/api/cart");

export const addToCart = (productId: string, quantity: number) =>
  apiFetch<CartResponse>("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });

export const updateCartItem = (itemId: string, quantity: number) =>
  apiFetch<CartResponse>(`/api/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });

export const removeCartItem = (itemId: string) =>
  apiFetch<CartResponse>(`/api/cart/items/${itemId}`, { method: "DELETE" });

export const clearCart = () =>
  apiFetch<{ message: string }>("/api/cart", { method: "DELETE" });

// Checkout
export const createCheckout = () =>
  apiFetch<CheckoutResponse>("/api/checkout", { method: "POST" });

// Orders
export const getOrders = (page = 1, limit = 10) =>
  apiFetch<OrdersResponse>(`/api/orders?page=${page}&limit=${limit}`);

export const getOrder = (orderId: string) =>
  apiFetch<OrderResponse>(`/api/orders/${orderId}`);

// User
export const getProfile = () => apiFetch<UserResponse>("/api/users/me");

export const updateProfile = (data: {
  name?: string;
  phone?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}) =>
  apiFetch<UserResponse>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
