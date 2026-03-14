export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  whopCheckoutId: string;
  whopPaymentId?: string;
  shippingAddress: ShippingAddress;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  _id: string;
  neonAuthId: string;
  email: string;
  name: string;
  role: "customer" | "admin";
  phone?: string;
  shippingAddress?: ShippingAddress;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface CartResponse {
  cart: Cart;
}

export interface CheckoutResponse {
  checkoutId: string;
  purchaseUrl: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

export interface OrderResponse {
  order: Order;
}

export interface UserResponse {
  user: UserProfile;
}
