import Database from "better-sqlite3";
import { drizzle as drizzleLocal } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzleTurso, type LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

type DbDriver = "local" | "turso";

const dbDriver: DbDriver =
  (process.env.DB_DRIVER as DbDriver | undefined) ||
  (process.env.VERCEL ? "turso" : "local");

const DB_PATH =
  process.env.DATABASE_PATH || path.join(process.cwd(), "data", "ecommerce.db");

const TURSO_URL = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
const TURSO_AUTH_TOKEN =
  process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

function createLocalSQLite() {
  const dataDir = path.dirname(DB_PATH);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const sqlite = new Database(DB_PATH);
  sqlite.pragma("foreign_keys = ON");
  return sqlite;
}

type LocalSQLite = ReturnType<typeof createLocalSQLite>;

type QueryColumn = {
  name: string;
  notnull: number;
};

function ensureOrdersUserIdNullable(sqlite: LocalSQLite) {
  const columns = sqlite.prepare("PRAGMA table_info(orders)").all() as QueryColumn[];

  const userIdColumn = columns.find((column) => column.name === "user_id");
  if (!userIdColumn || userIdColumn.notnull === 0) {
    return;
  }

  // Legacy local databases may have orders.user_id as NOT NULL.
  sqlite.exec(`
    PRAGMA foreign_keys = OFF;
    BEGIN TRANSACTION;

    CREATE TABLE orders_new (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      user_email TEXT NOT NULL,
      order_number TEXT NOT NULL UNIQUE,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
      whop_checkout_id TEXT NOT NULL UNIQUE,
      whop_payment_id TEXT,
      shipping_address TEXT NOT NULL,
      paid_at INTEGER,
      shipped_at INTEGER,
      delivered_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    INSERT INTO orders_new (
      id,
      user_id,
      user_email,
      order_number,
      subtotal,
      tax,
      total,
      status,
      whop_checkout_id,
      whop_payment_id,
      shipping_address,
      paid_at,
      shipped_at,
      delivered_at,
      created_at,
      updated_at
    )
    SELECT
      id,
      user_id,
      user_email,
      order_number,
      subtotal,
      tax,
      total,
      status,
      whop_checkout_id,
      whop_payment_id,
      shipping_address,
      paid_at,
      shipped_at,
      delivered_at,
      created_at,
      updated_at
    FROM orders;

    DROP TABLE orders;
    ALTER TABLE orders_new RENAME TO orders;

    COMMIT;
    PRAGMA foreign_keys = ON;
  `);
}

function initLocalDb(sqlite: LocalSQLite) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      neon_auth_id TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
      phone TEXT,
      shipping_address TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'usd',
      images TEXT,
      category TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      user_email TEXT NOT NULL,
      order_number TEXT NOT NULL UNIQUE,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
      whop_checkout_id TEXT NOT NULL UNIQUE,
      whop_payment_id TEXT,
      shipping_address TEXT NOT NULL,
      paid_at INTEGER,
      shipped_at INTEGER,
      delivered_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL REFERENCES products(id),
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS carts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      cart_id TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL REFERENCES products(id),
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      image TEXT
    );
  `);

  ensureOrdersUserIdNullable(sqlite);

  sqlite.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_neon_auth_id ON users(neon_auth_id);
    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
    CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
  `);
}

export type AppDatabase = LibSQLDatabase<typeof schema>;

let dbInstance: AppDatabase;

if (dbDriver === "turso") {
  if (!TURSO_URL) {
    throw new Error(
      "DB_DRIVER=turso requires TURSO_DATABASE_URL (or DATABASE_URL)."
    );
  }

  const tursoClient = createClient({
    url: TURSO_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  dbInstance = drizzleTurso(tursoClient, { schema });
} else {
  const sqlite = createLocalSQLite();
  initLocalDb(sqlite);
  dbInstance = drizzleLocal(sqlite, { schema }) as unknown as AppDatabase;
}

// Shared db export for all data access code.
export const db = dbInstance;
export { dbDriver };

// Export schema for use in queries
export * from "./schema";
