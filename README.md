# The Social Club

A production-ready registration website for **The Social Club** — a collaborative monthly social hangout for teens and young adults with disabilities, presented by **Endless Sports** and **We Will Walk With You**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + custom design system |
| Database | Supabase (PostgreSQL) |
| Payments | Stripe Checkout |
| Email | Nodemailer + Gmail App Password |
| Deployment | Vercel |

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local` (see Environment Variables section below).

### 3. Set up Supabase

Run the schema in your Supabase SQL editor:

```bash
# Copy contents of supabase/schema.sql and paste into:
# Supabase Dashboard → SQL Editor → New Query → Run
```

### 4. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.example` to `.env.local` and populate each value:

### Supabase

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (from Project Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key — **never expose to the browser** |

### Stripe

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` for dev, `sk_live_...` for prod) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret from Stripe Dashboard |

### Email

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Your Gmail address |
| `SMTP_PASSWORD` | Gmail App Password (see Email Setup below) |

### Site & Admin

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Full production URL (e.g. `https://thesocialclub.org`) |
| `ADMIN_SECRET` | Server-side secret for `/api/admin/registrations` |
| `NEXT_PUBLIC_ADMIN_SECRET` | Same value — used by the admin dashboard client |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Password for the `/admin` dashboard login screen |

---

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New Query**
3. Paste the contents of `supabase/schema.sql` and click **Run**
4. Copy your project URL, anon key, and service role key from **Project Settings → API**

Row-level security is enabled — all reads and writes go through the server-side service role client (`supabaseAdmin`), never the browser.

---

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. In **Developers → API keys**, copy your test keys for development
3. To receive webhook events locally, install the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. In production, create a webhook endpoint in **Stripe Dashboard → Developers → Webhooks**:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `checkout.session.expired`
5. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`

**Note:** Payment is confirmed via webhook, not the success redirect. This ensures payment status is accurate even if the user closes the browser before returning.

---

## Email Setup (Gmail App Password)

1. Enable **2-Step Verification** on your Google account
2. Go to [myaccount.google.com](https://myaccount.google.com) → **Security → App Passwords**
3. Generate a new App Password for "Mail / Other (custom name)"
4. Use that 16-character password as `SMTP_PASSWORD`

---

## Vercel Deployment

### First deployment

```bash
npm i -g vercel
vercel login
vercel link
vercel env add  # add each variable from .env.example
vercel --prod
```

### Environment variables on Vercel

Add all variables from `.env.example` via the Vercel Dashboard (**Project → Settings → Environment Variables**) or CLI:

```bash
vercel env add STRIPE_SECRET_KEY production
```

### Stripe webhook in production

After deploying, update your Stripe webhook endpoint URL to your production domain:

```
https://your-domain.com/api/webhooks/stripe
```

---

## Event Configuration

All event details (date, time, location, capacity, donation amount) are centralized in:

```
src/config/event.ts
```

Update this file whenever event details change. The entire site and all emails pull from this single source of truth.

---

## Admin Dashboard

Visit `/admin` on your deployed site. Enter the `NEXT_PUBLIC_ADMIN_PASSWORD` to access:

- Live registration count (total, confirmed, scholarship, pending)
- Searchable/filterable registration table
- CSV export of all registrations

The table data is fetched from `/api/admin/registrations`, which requires the `ADMIN_SECRET` bearer token.

---

## Registration Flow

```
User fills multi-step form (4 steps)
         │
         ▼
POST /api/register
         │
    ┌────┴────┐
    │         │
Scholarship  Payment
    │         │
    ▼         ▼
 Complete   Stripe Checkout
 + Email         │
              Webhook: checkout.session.completed
                 │
              Update DB → Complete + Email
```

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── register/route.ts          # Registration API
│   │   ├── webhooks/stripe/route.ts   # Stripe webhook
│   │   └── admin/registrations/route.ts
│   ├── admin/page.tsx                 # Admin dashboard
│   ├── registration/
│   │   ├── success/page.tsx
│   │   └── canceled/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                       # Main landing page
├── components/
│   └── RegistrationForm.tsx           # Multi-step form
├── config/
│   └── event.ts                       # Central event config
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   └── email.ts
└── types/
    └── registration.ts
supabase/
└── schema.sql
```
