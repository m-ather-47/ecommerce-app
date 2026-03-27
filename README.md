
## Database Setup (Local + Vercel)

This project supports two database drivers using the `DB_DRIVER` environment variable:

- `local`: uses a local SQLite file (`data/ecommerce.db`)
- `turso`: uses a remote Turso/libSQL database

### Local development

Use `.env.local`:

```env
DB_DRIVER=local
DATABASE_PATH=./data/ecommerce.db
```

### Vercel production

Set these environment variables in Vercel:

```env
DB_DRIVER=turso
TURSO_DATABASE_URL=libsql://<your-database-url>
TURSO_AUTH_TOKEN=<your-auth-token>
```

### Initialization / migrations

Run database initialization manually:

```bash
npm run db:init
```

The build script runs `db:init` automatically before `next build`, so Vercel deployments initialize schema safely on deploy.
