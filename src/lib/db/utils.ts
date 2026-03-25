import { randomUUID } from "crypto";

// Generate a unique ID for database records
export function generateId(): string {
  return randomUUID();
}

// Generate a unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Parse JSON safely with fallback
export function parseJson<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Stringify value to JSON
export function toJson<T>(value: T): string {
  return JSON.stringify(value);
}
