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

// Helper functions to map between SQLite and API format
export function mapProductToApi(product: {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  images: string | null;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Product {
  return {
    _id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    currency: product.currency,
    images: product.images ? JSON.parse(product.images) : [],
    category: product.category,
    stock: product.stock,
    isActive: product.isActive,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function mapUserToApi(user: {
  id: string;
  neonAuthId: string;
  email: string;
  name: string;
  role: "customer" | "admin";
  phone: string | null;
  shippingAddress: string | null;
}): UserProfile {
  return {
    _id: user.id,
    neonAuthId: user.neonAuthId,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone || undefined,
    shippingAddress: user.shippingAddress
      ? JSON.parse(user.shippingAddress)
      : undefined,
  };
}

export function mapOrderToApi(
  order: {
    id: string;
    userId: string | null;
    orderNumber: string;
    subtotal: number;
    tax: number;
    total: number;
    status: OrderStatus;
    whopCheckoutId: string;
    whopPaymentId: string | null;
    shippingAddress: string;
    paidAt: Date | null;
    shippedAt: Date | null;
    deliveredAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  },
  items: OrderItem[]
): Order {
  return {
    _id: order.id,
    userId: order.userId || "",
    orderNumber: order.orderNumber,
    items,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    status: order.status,
    whopCheckoutId: order.whopCheckoutId,
    whopPaymentId: order.whopPaymentId || undefined,
    shippingAddress: JSON.parse(order.shippingAddress),
    paidAt: order.paidAt?.toISOString(),
    shippedAt: order.shippedAt?.toISOString(),
    deliveredAt: order.deliveredAt?.toISOString(),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

export function mapCartToApi(
  cart: { id: string; userId: string } | null,
  items: CartItem[]
): Cart {
  return {
    _id: cart?.id,
    userId: cart?.userId || "",
    items,
  };
}

export function mapCartItemToApi(item: {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}): CartItem {
  return {
    _id: item.id,
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image || undefined,
  };
}

export function mapOrderItemToApi(item: {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}): OrderItem {
  return {
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image || undefined,
  };
}
