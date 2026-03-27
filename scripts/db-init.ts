import * as dotenv from "dotenv";
import Database from "better-sqlite3";
import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

type DbDriver = "local" | "turso";
type QueryRow = Record<string, unknown>;

type Runner = {
  execute: (statement: string) => Promise<void>;
  query: (statement: string) => Promise<QueryRow[]>;
  close: () => Promise<void>;
};

const MIGRATION_ID = "001_initial_schema";
const DB_DRIVER: DbDriver =
  (process.env.DB_DRIVER as DbDriver | undefined) ||
  (process.env.VERCEL ? "turso" : "local");

const DB_PATH =
  process.env.DATABASE_PATH || path.join(process.cwd(), "data", "ecommerce.db");

const TURSO_URL = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
const TURSO_AUTH_TOKEN =
  process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    neon_auth_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
    phone TEXT,
    shipping_address TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS products (
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
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
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
  )`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id),
    name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    image TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS carts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY,
    cart_id TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id),
    name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    image TEXT
  )`,
  "CREATE INDEX IF NOT EXISTS idx_users_neon_auth_id ON users(neon_auth_id)",
  "CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)",
  "CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)",
  "CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active)",
  "CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)",
  "CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)",
  "CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)",
  "CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id)",
] as const;

async function createRunner(): Promise<Runner> {
  if (DB_DRIVER === "turso") {
    if (!TURSO_URL) {
      throw new Error(
        "Turso mode requires TURSO_DATABASE_URL (or DATABASE_URL) to be set."
      );
    }

    const client = createClient({
      url: TURSO_URL,
      authToken: TURSO_AUTH_TOKEN,
    });

    return {
      execute: async (statement: string) => {
        await client.execute(statement);
      },
      query: async (statement: string) => {
        const result = await client.execute(statement);
        return (result.rows as QueryRow[]) || [];
      },
      close: async () => {
        await client.close();
      },
    };
  }

  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const sqlite = new Database(DB_PATH);
  sqlite.pragma("foreign_keys = ON");

  return {
    execute: async (statement: string) => {
      sqlite.exec(statement);
    },
    query: async (statement: string) => {
      return sqlite.prepare(statement).all() as QueryRow[];
    },
    close: async () => {
      sqlite.close();
    },
  };
}

function getColumnNumber(row: QueryRow, key: string): number {
  const value = row[key];
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return 0;
}

async function ensureOrdersUserIdNullableLocal(runner: Runner): Promise<void> {
  const columns = await runner.query("PRAGMA table_info(orders)");
  const userIdColumn = columns.find((column) => String(column.name) === "user_id");

  if (!userIdColumn || getColumnNumber(userIdColumn, "notnull") === 0) {
    return;
  }

  await runner.execute("PRAGMA foreign_keys = OFF");
  await runner.execute("BEGIN TRANSACTION");

  try {
    await runner.execute(`CREATE TABLE orders_new (
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
    )`);

    await runner.execute(`INSERT INTO orders_new (
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
    FROM orders`);

    await runner.execute("DROP TABLE orders");
    await runner.execute("ALTER TABLE orders_new RENAME TO orders");
    await runner.execute("COMMIT");
  } catch (error) {
    await runner.execute("ROLLBACK");
    throw error;
  } finally {
    await runner.execute("PRAGMA foreign_keys = ON");
  }
}

async function ensureDatabaseInitialized(runner: Runner): Promise<void> {
  await runner.execute(`CREATE TABLE IF NOT EXISTS _schema_migrations (
    id TEXT PRIMARY KEY,
    applied_at INTEGER NOT NULL
  )`);

  const existing = await runner.query(
    `SELECT id FROM _schema_migrations WHERE id = '${MIGRATION_ID}' LIMIT 1`
  );

  if (existing.length > 0) {
    console.log(`Migration ${MIGRATION_ID} already applied.`);
    if (DB_DRIVER === "local") {
      await ensureOrdersUserIdNullableLocal(runner);
    }
    return;
  }

  for (const statement of SCHEMA_STATEMENTS) {
    await runner.execute(statement);
  }

  if (DB_DRIVER === "local") {
    await ensureOrdersUserIdNullableLocal(runner);
  }

  await runner.execute(
    `INSERT INTO _schema_migrations (id, applied_at) VALUES ('${MIGRATION_ID}', ${Date.now()})`
  );

  console.log(`Applied migration ${MIGRATION_ID} using ${DB_DRIVER} driver.`);
}

async function main(): Promise<void> {
  const runner = await createRunner();

  try {
    await ensureDatabaseInitialized(runner);
  } finally {
    await runner.close();
  }
}

main().catch((error) => {
  console.error("Database initialization failed:", error);
  process.exit(1);
});
