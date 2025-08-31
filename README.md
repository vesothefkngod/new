# Dark Crypto Store — Postgres + Docker (username-only auth, local captcha)

This package contains a ready-to-run Node.js/Express shop with Postgres (via Docker Compose),
authentication using **username + password** (no email), local math captcha for bot protection,
and OxaPay checkout integration (sandbox-ready - adjust base URL and API key).

## What's included
- Node backend (Express + EJS)
- Postgres database (in docker-compose)
- Auth: username/password (bcrypt) + math captcha on login/register
- Orders table (simple), products (in-memory demo)
- OxaPay checkout flow (only OxaPay) — stubbed payload, adjust to your OxaPay API
- Design is taken from your `index.ejs` and placed in `views/design/` + partials
- Dockerized: `docker-compose.yml` to launch app + db

## Quick start (Docker - recommended)
1. Copy `.env.example` to `.env` and edit if needed. At minimum set `OXAPAY_API_KEY` if you want to test real invoices.
2. Build & run:
   ```bash
   docker-compose up --build
   ```
3. Open: `http://localhost:3000`

## Test user (optional)
If you want a test user quickly, run this inside the running app container (or run psql against the db):
```sql
INSERT INTO users(username, password_hash) VALUES('test', '$2b$10$KIX/ZOvQ6u4k9Cj1XkRzXeY0cR8s3Gf9a1oK8x6vYQeJ3p1YqG9bW'); -- password: test1234
```

## Local dev without Docker (optional)
1. Install PostgreSQL and create DB `darkstore` or edit `DATABASE_URL` in `.env`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start server:
   ```bash
   npm run dev
   ```

## Database
On first run the app will create `users` and `orders` tables automatically. Default DB credentials in docker-compose:
- user: `postgres`
- password: `postgres`
- db: `darkstore`

## OxaPay
- Put your `OXAPAY_API_KEY` and `OXAPAY_BASE_URL` in `.env` (or export before docker-compose).
- The checkout endpoint posts to `${OXAPAY_BASE_URL}/invoice` — adjust if OxaPay has a different path.
- Webhook endpoint: `/pay/webhook/oxapay` (verify signatures in production).

## Notes for security & production
- Change `SESSION_SECRET` in `.env` before going to production.
- Use HTTPS and proper cookie `secure` flag in production.
- Add webhook signature verification for OxaPay (TODO in code).
- Replace in-memory products with your DB or admin panel for product management.

If you want, I can now:
- add Prisma/Sequelize migrations,
- add admin panel for products,
- add webhook signature verification & Telegram notifications.

Enjoy, брат!
