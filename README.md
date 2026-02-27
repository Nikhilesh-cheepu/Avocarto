# Avacarto

**Avocado Is a Lifestyle.**

Pre-launch landing page and simple admin for Avacarto. Built with Next.js (App Router), TypeScript, and PostgreSQL on Railway.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **PostgreSQL on Railway** for `site_settings` and `subscribers`

## Setup

### 1. Install and run locally

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set DATABASE_URL (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

### 2. Database (Railway Postgres)

1. Create a new project on [Railway](https://railway.app) and add a **PostgreSQL** service.
2. Copy the `DATABASE_URL` from the service variables into `.env.local`.
3. Run the schema once (Railway SQL console or `psql $DATABASE_URL -f schema.sql`):

```bash
psql "$DATABASE_URL" -f schema.sql
```

Or in Railway’s SQL tab, paste and run the contents of `schema.sql`.

### 3. Logo

The header uses a placeholder “A” until you add your logo. To use your own:

- Add `public/logo.png` (or `logo.svg`).
- In `src/components/Header.tsx`, replace the placeholder div with `next/image` pointing to `/logo.png`.

## What’s included

- **Landing page**: Announcement bar, header, hero, about, First Drop (3 placeholder products), What’s Coming, email subscribe, footer. All main texts are editable from the admin.
- **Admin** (`/admin`): Edit landing page copy and view/export subscribers (CSV). No auth in this phase; secure the admin route (e.g. auth or private URL) when needed.

## Environment

| Variable        | Description                          |
|----------------|--------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string (Railway) |

## Future-proofing

The codebase is prepared for (not implemented):

- **Phone OTP login** (e.g. `users` with `phone_number`, OTP verification).
- **Roles** (admin / user).
- **Full ecommerce**: products, orders, inventory.

See comments in `schema.sql` for future table ideas.

## Scripts

- `npm run dev` – development server
- `npm run build` – production build
- `npm run start` – run production server
- `npm run lint` – ESLint
