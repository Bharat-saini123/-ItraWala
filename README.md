# तोरणद्वार ItraWala

A full e-commerce site for a traditional Indian attar / perfume brand, built with
**Next.js 14 (App Router) + TypeScript + Prisma + Supabase**.

- Public storefront: home, shop with filters, product detail, cart, checkout (COD),
  about, contact, login/register, account & order history.
- Admin panel: dashboard, product management (create/edit/delete, show/hide on
  storefront, edit stock inline, upload/remove images), order management
  (view details, update status).
- Auth, database and image storage all run on **Supabase**; **Prisma** is the
  ORM on top of Supabase's Postgres.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**. Pick any name/region
   and set a database password (save it, you'll need it below).
2. In **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret, not used by the
     app directly today but handy for future admin scripts)
3. In **Project Settings → Database → Connection string**, copy the pooled
   connection string (port `6543`) into `DATABASE_URL` and the direct
   connection (port `5432`) into `DIRECT_URL`. Replace `[YOUR-PASSWORD]` with
   the password you set in step 1.

Copy `.env.example` to `.env` and fill in all the values above.

## 2. Install dependencies & create the database tables

```bash
npm install
npx prisma migrate dev --name init
```

This creates `profiles`, `categories`, `products`, `orders`, `order_items` in
your Supabase Postgres database.

## 3. Run the Supabase setup SQL

Open **Supabase Dashboard → SQL Editor**, paste the contents of
`supabase/setup.sql`, and run it. This adds:

- A trigger that auto-creates a `profiles` row whenever someone signs up.
- Row Level Security policies (public can read visible products/categories;
  only admins can write; customers can only see their own orders/profile).
- A public `products` Storage bucket with policies so only admins can upload.

## 4. Seed sample products (optional but recommended)

```bash
npm run seed
```

This adds 4 categories and 12 sample attar/perfume products so the storefront
isn't empty on first run. Delete or edit them any time from the admin panel.

## 5. Make yourself an admin

1. Run the app (`npm run dev`) and sign up for an account at `/register`.
2. Confirm your email (check inbox — Supabase sends the confirmation link).
3. In **Supabase Dashboard → SQL Editor**, run:

   ```sql
   update public.profiles set role = 'ADMIN' where email = 'your@email.com';
   ```

4. Sign in and visit `/admin` — you now have full access to products and orders.

## 6. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Project structure

```
src/
  app/            → pages (App Router) — storefront, auth, admin, checkout
  components/      → shared UI (Navbar, Footer, ProductCard, admin widgets...)
  lib/             → prisma client, supabase clients, cart store, utils
  types/           → shared TypeScript types
prisma/
  schema.prisma    → database schema
  seed.ts          → sample data
supabase/
  setup.sql        → RLS policies + storage bucket (run once in SQL Editor)
```

## Notes

- Checkout is **Cash on Delivery** by default (no payment gateway wired up) —
  swap in Razorpay/Stripe in `src/app/checkout/actions.ts` when you're ready.
- Product images can be uploaded directly from the admin panel (stored in the
  Supabase `products` bucket) or added by pasting an image URL.
- Admins control which products appear on the storefront via the **Visible**
  toggle on `/admin/products` — hidden products stay in the database but are
  filtered out of `/shop` and search.
- Colors, fonts and the arch/gateway motif (echoing "तोरणद्वार" = *gateway*)
  are defined in `tailwind.config.ts` and `src/components/ArchDivider.tsx` —
  tweak these to restyle the whole site.
