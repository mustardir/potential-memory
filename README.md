# Fortress

Institutional wealth management platform built with Next.js 14, Prisma, PostgreSQL, and TypeScript.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict) |
| Database | PostgreSQL via Prisma 5 |
| Auth | iron-session + bcryptjs |
| Styling | Tailwind CSS 3 |
| Validation | Zod |
| Monorepo | pnpm workspaces |
| Deployment | Vercel |

---

## Project structure

```
fortress/
├── apps/
│   ├── web/              ← Main production app
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── src/
│   │       ├── app/
│   │       │   ├── api/          ← API routes
│   │       │   ├── dashboard/
│   │       │   ├── wallet/
│   │       │   ├── investments/
│   │       │   ├── transactions/
│   │       │   ├── settings/
│   │       │   ├── admin/
│   │       │   ├── login/
│   │       │   ├── register/
│   │       │   └── page.tsx      ← Landing page
│   │       ├── components/
│   │       │   ├── ui/           ← Button, Input, Card, Badge, StatCard
│   │       │   └── layout/       ← Sidebar, TopNav
│   │       └── lib/
│   │           ├── prisma.ts     ← DB singleton
│   │           ├── auth.ts       ← Auth utilities
│   │           ├── session.ts    ← iron-session config
│   │           ├── env.ts        ← Validated env vars
│   │           ├── validations.ts← Zod schemas
│   │           ├── rate-limit.ts ← Request rate limiting
│   │           ├── api.ts        ← Response helpers
│   │           └── utils.ts      ← Formatters
│   ├── admin/            ← Future admin panel
│   └── client/           ← Future mobile client
├── pnpm-workspace.yaml
├── vercel.json
└── README.md
```

---

## Local development

### Prerequisites

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- A PostgreSQL database (local or cloud)

### 1. Clone and install

```bash
git clone https://github.com/your-org/fortress.git
cd fortress
pnpm install
```

### 2. Configure environment

```bash
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/web/.env.local`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/fortress"
DIRECT_URL="postgresql://postgres:password@localhost:5432/fortress"
SESSION_SECRET="your-32-plus-character-random-secret-here"
NODE_ENV="development"
```

Generate a secure SESSION_SECRET:

```bash
openssl rand -base64 32
```

### 3. Database setup

```bash
# Run migrations
pnpm db:migrate

# Or push schema directly (development only)
pnpm db:push

# Generate Prisma client
pnpm db:generate

# Seed with demo data
pnpm db:seed
```

### 4. Run development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts (after seeding)

| Email | Password | Role |
|---|---|---|
| `demo@fortress-fund.com` | `Demo@123456` | User |
| `admin@fortress-fund.com` | `Admin@123456` | Admin |

---

## Available commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build (runs prisma generate first)
pnpm start        # Start production server
pnpm lint         # ESLint
pnpm typecheck    # TypeScript check (no emit)
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run pending migrations (production)
pnpm db:push      # Push schema changes (development)
pnpm db:studio    # Open Prisma Studio
pnpm db:seed      # Seed demo data
```

---

## Database setup guide

### Option A — Supabase (recommended for Vercel)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database → Connection string**
3. Copy the **URI** (pooled) → use as `DATABASE_URL`
4. Copy the **Direct connection** URI → use as `DIRECT_URL`
5. The `?pgbouncer=true&connection_limit=1` params are required on the pooled URL

```env
DATABASE_URL="postgresql://postgres.xxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.xxxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

### Option B — Neon

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the **Pooled connection string** → `DATABASE_URL`
3. Copy the **Direct connection string** → `DIRECT_URL`

### Option C — Railway

1. Create a PostgreSQL service at [railway.app](https://railway.app)
2. Copy `DATABASE_URL` from the service variables
3. Use the same URL for both `DATABASE_URL` and `DIRECT_URL`

### Running migrations in production

```bash
# Always use migrate deploy (not db push) in production
pnpm db:migrate
```

---

## Vercel deployment guide

### 1. Import repository

- Go to [vercel.com/new](https://vercel.com/new)
- Import your GitHub/GitLab repository
- Set **Root Directory** to `apps/web` — or leave as root (vercel.json handles it)
- Framework preset: **Next.js**

### 2. Environment variables

In Vercel → Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Pooled PostgreSQL URL |
| `DIRECT_URL` | Direct PostgreSQL URL |
| `SESSION_SECRET` | 32+ char random string |
| `NODE_ENV` | `production` |

### 3. Build settings (auto-detected from vercel.json)

```
Build Command:   cd apps/web && pnpm install && pnpm build
Output Directory: apps/web/.next
Install Command: pnpm install
```

### 4. Custom domain

- Vercel → Settings → Domains
- Add `fortress-fund.com` and `www.fortress-fund.com`
- Update your DNS:
  - `@` → Vercel A record (76.76.21.21)
  - `www` → CNAME → `cname.vercel-dns.com`

### 5. Run database migrations post-deploy

Either:
- Add a **Post-build command** in Vercel: `prisma migrate deploy`
- Or run from local with production `DATABASE_URL`:

```bash
DATABASE_URL="your-prod-url" DIRECT_URL="your-prod-direct-url" pnpm db:migrate
```

---

## Security features

| Feature | Implementation |
|---|---|
| Password hashing | bcryptjs, cost factor 12 |
| Session | iron-session, HttpOnly + Secure cookie |
| Route protection | Next.js middleware (edge) |
| Input validation | Zod on all API routes |
| Rate limiting | In-memory per-IP (15 min windows) |
| Security headers | X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy |
| SQL injection | Prevented by Prisma parameterised queries |
| XSS | React escaping + HttpOnly cookies |

> **Production note:** The in-memory rate limiter resets on each serverless function cold start. For multi-instance production use, replace `src/lib/rate-limit.ts` with a Redis-backed implementation (Upstash recommended for Vercel).

---

## API routes

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Sign in |
| POST | `/api/auth/logout` | Public | Sign out |
| GET | `/api/auth/me` | Required | Current user |
| GET | `/api/wallet` | Required | Wallet + recent txns |
| POST | `/api/wallet` | Required | Deposit / withdraw |
| GET | `/api/transactions` | Required | Paginated history |
| GET | `/api/investments` | Required | Portfolio + summary |
| GET | `/api/user/profile` | Required | Full profile |
| PATCH | `/api/user/profile` | Required | Update profile / password |

---

## Data models

```
User ─── UserProfile
     ─── Wallet ─── Transaction
     ─── Investment
     ─── Session
AuditLog (standalone)
```

---

## TypeScript verification

```bash
pnpm typecheck       # tsc --noEmit
pnpm build           # next build (also type-checks)
```

---

## License

Private — Fortress Fund. All rights reserved.
