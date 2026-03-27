
# Ecommerce Store

A modern, full-stack ecommerce application built with **Next.js 16**, **React 19**, and **TypeScript**. The project includes a customer-facing storefront, a protected admin dashboard, authentication via **Neon Auth**, and data persistence via **Drizzle ORM** with either a local SQLite file or a **Turso** remote database.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Database | Drizzle ORM + SQLite (local) / Turso (production) |
| Auth | Neon Auth (`@neondatabase/auth`) |
| Validation | Zod |
| Language | TypeScript (strict) |

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── (shop)/               # Customer-facing routes (home, products, cart, checkout, orders)
│   ├── (company)/            # Company pages (about, privacy, terms, sustainability, press)
│   ├── (support)/            # Support pages (contact, faq, shipping, returns)
│   ├── admin/                # Admin dashboard (inventory, orders, products, users)
│   ├── api/                  # API route handlers (auth, cart, checkout, orders, products, users)
│   └── auth/                 # Auth pages (login, register)
├── components/               # Shared React components
│   └── admin/                # Admin-specific components
├── contexts/                 # React contexts (CartContext)
└── lib/                      # Core utilities
    ├── db/                   # Drizzle schema, DB client, migrations
    ├── schemas/              # Zod validation schemas
    ├── middleware/           # Auth & role middleware
    └── auth/                 # Client & server auth helpers

scripts/
├── db-init.ts                # Database initialization & migration runner
├── seed-products.ts          # Seed product catalog
└── seed-admin.ts            # Seed admin user

data/
└── ecommerce.db              # Local SQLite database file
```

## Features

### Storefront
- Product catalog with filters and pagination
- Product detail pages with image gallery
- Shopping cart with add/remove/update quantities
- Guest and authenticated checkout flow
- Order tracking
- User account management

### Admin Dashboard
- Inventory management
- Order status management
- Product management (create, edit)
- User role management (customer, admin)

### Auth
- Email/password registration and login via Neon Auth
- Session persistence across server and client
- Role-based access control (customer, admin)
- Protected routes for account, orders, and admin

## Getting Started

### Prerequisites

- Node.js 20+
- npm / pnpm / bun

### Installation

```bash
git clone https://github.com/m-ather-47/ecommerce-app.git
cd ecommerce-app
npm install
```

### Configure environment

Create a `.env.local` file in the project root:

```env
# Auth — get these from https://neon.tech
NEON_AUTH_BASE_URL=<your-neon-auth-url>

# App URL
NEXT_PUBLIC_APP_URL=<your-website-base-url>

# Database driver: "local" (SQLite) or "turso" (remote)
DB_DRIVER=local
DATABASE_PATH=./data/ecommerce.db

# For Turso production:
# DB_DRIVER=turso
# TURSO_DATABASE_URL=libsql://<your-database-url>
# TURSO_AUTH_TOKEN=<your-auth-token>
```

### Initialize the database

```bash
npm run db:init
```

This creates the SQLite database file (`data/ecommerce.db`) and runs all schema migrations idempotently. The `build` script also runs this automatically, so it executes on every Vercel deploy.

### Seed initial data

```bash
# Seed the product catalog
npm run seed

# Create an admin user (email: admin@popgear.com / password: admin123)
npm run seed:admin
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Run `db:init` then build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:init` | Initialize / migrate the database |
| `npm run seed` | Seed the product catalog |
| `npm run seed:admin` | Create the default admin account |

