# FunReveal 🔮

> **Discover. Calculate. Unlock.**  
> A production-oriented full-stack entertainment platform featuring 7 engaging tools, a deterministic calculation engine, secure result locking, Razorpay payment integration (₹5 per unlock), and a protected admin analytics dashboard.

---

## 1. Project Overview

FunReveal is a modern web application designed for pure amusement and social entertainment. Users choose from 7 calculation and quiz tools:

1. **Love Compatibility Calculator** — Deterministic score (1–100), cosmic title, description, relationship category, and 4 love pillars.
2. **Friendship Bond Calculator** — Deterministic score, category, friendship message, and 4 vibe pillars.
3. **Future Partner Generator** — Fictional partner persona, aesthetic vibe, curated interests, and meet-cute story.
4. **Marriage Compatibility** — Entertainment compatibility, communication category, personality contrast, and domestic synergy.
5. **Lucky Number Generator** — Primary lucky number (1–9), secondary numbers, lucky colour palette with hex code, and power element.
6. **Best Friend Test** — Interactive two-player quiz with 6 matching questions and true match ratio calculation.
7. **Personality Test** — 10-question evaluation mapping to one of 4 dominant archetypes (Vibrant Social, Reflective Observer, Creative Free Spirit, Strategic Problem Solver).

### The Unlock Flow
- **Input & Calculation**: Users submit their details. The backend validates with Zod, executes the calculation engine, and stores the full result in PostgreSQL behind a server-side lock.
- **Safe Preview**: The client receives ONLY safe teaser metadata and a masked score placeholder (`?? %`). The full result is never exposed in network responses or client state prior to verified payment.
- **Razorpay Checkout**: User clicks "Unlock Full Result — ₹5 Only" to initiate payment via Razorpay.
- **Cryptographic Verification**: Server independently verifies the HMAC-SHA256 signature using the Razorpay Key Secret. Only upon cryptographic verification is the session marked `PAID`.
- **Unlock**: The unlocked result renders with scores, charts, breakdown pillars, and social share actions.

> **Entertainment Disclaimer**: All calculations and predictions are strictly for entertainment. FunReveal never claims to scientifically predict love, marriage, personality, or destiny.

---

## 2. Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions, Route Handlers)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + Custom Dark Purple & Neon Violet design system
- **UI Components**: Radix UI Primitives, Lucide Icons, Class Variance Authority
- **Database & ORM**: PostgreSQL with [Prisma ORM 6.4.0](https://www.prisma.io/)
- **Payments**: Official Razorpay SDK (`razorpay`) with server-side HMAC-SHA256 verification & webhook idempotency
- **Validation**: Zod 4
- **Admin Authentication**: NextAuth.js v5 (JWT session cookies, bcryptjs password hashing)
- **Testing**: Jest + ts-jest (51 automated tests covering calculators, validation, and payment security)

---

## 3. Project Structure

```text
├── prisma/
│   ├── schema.prisma              # PostgreSQL database models & enums
│   └── seed.ts                    # Admin user & default site settings seeder
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx # Admin dashboard with revenue & transaction table
│   │   │   └── login/page.tsx     # Admin authentication login
│   │   ├── api/
│   │   │   ├── admin/dashboard/   # Admin metrics & transactions API
│   │   │   ├── admin/settings/    # Site settings & pricing configuration API
│   │   │   ├── auth/[...nextauth] # NextAuth route handler
│   │   │   ├── payments/
│   │   │   │   ├── create-order/  # Razorpay order generation handler
│   │   │   │   └── verify/        # Server-side cryptographic signature verification
│   │   │   ├── session/
│   │   │   │   ├── create/        # Validates input, calculates & creates locked session
│   │   │   │   └── [id]/          # Enforces server lock (unpaid vs paid data)
│   │   │   └── webhooks/razorpay/ # Idempotent webhook listener with HMAC verification
│   │   ├── tools/
│   │   │   ├── love-calculator/
│   │   │   ├── friendship-calculator/
│   │   │   ├── future-partner/
│   │   │   ├── marriage-compatibility/
│   │   │   ├── lucky-number/
│   │   │   ├── best-friend-test/
│   │   │   ├── personality-test/
│   │   │   └── page.tsx           # All tools catalog
│   │   ├── result/[id]/           # Locked preview & unlocked full report page
│   │   ├── contact/               # Contact support page
│   │   ├── disclaimer/            # Detailed entertainment disclaimer
│   │   ├── faq/                   # Frequently asked questions
│   │   ├── how-it-works/          # 4-step explanation guide
│   │   ├── privacy-policy/        # Legal privacy policy
│   │   ├── refund-policy/         # Legal refund policy
│   │   ├── terms-and-conditions/  # Terms of service
│   │   ├── globals.css            # Dark purple & neon violet theme
│   │   ├── layout.tsx             # Root layout with responsive Navbar & Footer
│   │   └── page.tsx               # Homepage with Hero, Grid, Features, FAQs & CTA
│   ├── components/
│   │   ├── layout/                # Navbar, Footer
│   │   ├── tools/                 # Reusable ToolFormWrapper
│   │   └── ui/                    # Button, Card, Input, Label, Badge, Progress
│   └── lib/
│       ├── calculators/           # 7 deterministic & quiz calculation engines
│       │   ├── love.ts
│       │   ├── friendship.ts
│       │   ├── future-partner.ts
│       │   ├── marriage.ts
│       │   ├── lucky-number.ts
│       │   ├── best-friend.ts
│       │   ├── personality.ts
│       │   ├── preview.ts         # Safe teasers (no sensitive data leaked)
│       │   └── utils.ts           # SHA-256 deterministic seeded hashing
│       ├── validations/tools.ts   # Zod validation schemas
│       ├── auth.ts                # NextAuth configuration
│       ├── db.ts                  # Prisma Client singleton
│       ├── payment-service.ts     # Payment creation, verification & webhooks
│       ├── razorpay.ts            # Razorpay SDK client & HMAC helpers
│       ├── session-service.ts     # Result session orchestration & access control
│       ├── settings.ts            # Dynamic tool pricing & feature toggles
│       └── utils.ts               # Currency formatting & class merge utilities
└── package.json
```

---

## 4. Installation Instructions

### Prerequisites
- **Node.js**: v18.18.0 or newer (tested on Node.js v24)
- **npm**: v9 or newer
- **PostgreSQL**: Local instance or managed provider (Neon, Supabase, Railway, AWS RDS)

### Steps
1. Clone the repository and enter the directory:
   ```bash
   cd Love
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

---

## 5. How to Run Locally

1. Generate Prisma Client:
   ```bash
   npm run db:generate
   ```
2. Push database schema to PostgreSQL:
   ```bash
   npm run db:push
   ```
3. Seed the database with the SuperAdmin account and default settings:
   ```bash
   npm run db:seed
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. PostgreSQL Setup

FunReveal requires a PostgreSQL database to securely store sessions, locked results, and audit logs.

### Option A: Cloud Database (Recommended - Free Tier)
Use any hosted PostgreSQL service:
- **Neon** ([neon.tech](https://neon.tech))
- **Supabase** ([supabase.com](https://supabase.com))
- **Railway** ([railway.app](https://railway.app))

Obtain your connection string and add it to `.env`:
```env
DATABASE_URL="postgresql://user:password@ep-xyz.region.neon.tech/funreveal?sslmode=require"
```

### Option B: Local PostgreSQL (Docker)
```bash
docker run --name funreveal-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=funreveal -p 5432:5432 -d postgres:16
```
Then set in `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/funreveal?schema=public"
```

---

## 7. Prisma Commands

| Command | Purpose |
| :--- | :--- |
| `npm run db:generate` | Regenerates the Prisma Client TypeScript bindings |
| `npm run db:push` | Pushes the schema directly to PostgreSQL (ideal for prototyping) |
| `npm run db:migrate` | Creates and applies SQL migration scripts for production |
| `npm run db:seed` | Populates the admin user and default site settings |

---

## 8. Razorpay Account Setup

1. Sign up for a Razorpay account at [https://dashboard.razorpay.com](https://dashboard.razorpay.com).
2. Complete your basic business profile verification.

---

## 9. Razorpay Test-Mode Setup

1. In your Razorpay Dashboard, toggle the switch at the top from **Live Mode** to **Test Mode**.
2. Navigate to **Account & Settings** → **API Keys** → click **Generate Key**.
3. Copy the **Key Id** (starts with `rzp_test_...`) and **Key Secret**.
4. Navigate to **Account & Settings** → **Webhooks** → click **Add New Webhook**:
   - **Webhook URL**: `https://your-domain.com/api/webhooks/razorpay` (or your ngrok URL for local testing)
   - **Secret**: Enter a secure random string (e.g., 32 characters)
   - **Active Events**: Check `payment.captured` and `order.paid`
5. Place these credentials in your `.env`:
   ```env
   RAZORPAY_KEY_ID="rzp_test_YourKeyIdHere"
   RAZORPAY_KEY_SECRET="YourKeySecretHere"
   RAZORPAY_WEBHOOK_SECRET="YourWebhookSecretHere"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_YourKeyIdHere"
   ```

*Note: If Razorpay credentials are missing or set to placeholder values, the app will safely instruct the user that configuration is required, refusing to produce fake payments.*

---

## 10. Environment Variable Configuration

Create a `.env` file based on `.env.example`:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pwd@host:5432/db` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_test_...` or `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | `SecretStringFromDashboard` |
| `RAZORPAY_WEBHOOK_SECRET` | Secret configured in Razorpay Webhooks | `YourWebhookSecretKey` |
| `AUTH_SECRET` | NextAuth JWT encryption secret (min 32 chars) | `openssl rand -base64 32` |
| `APP_URL` | Base URL of the website | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | Public base URL for client routing | `http://localhost:3000` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public Key ID exposed to frontend checkout | `rzp_test_...` |
| `ADMIN_EMAIL` | Default admin email for seeding | `admin@funreveal.com` |
| `ADMIN_PASSWORD` | Default admin password for seeding | `Admin@FunReveal2024!` |
| `DEFAULT_TOOL_PRICE_PAISE` | Default unlock price in paise (500 = ₹5) | `500` |

---

## 11. Admin Account Setup

1. Run the database seed:
   ```bash
   npm run db:seed
   ```
2. Visit `/admin/login` in your browser.
3. Sign in using the credentials defined in `.env`:
   - **Email**: `admin@funreveal.com`
   - **Password**: `Admin@FunReveal2024!` (or your custom password)
4. Through the protected `/admin/dashboard`, you can:
   - View real-time stats (Total Sessions, Paid Sessions, Conversion Rate, Total Revenue).
   - Inspect transaction logs (Order ID, Payment ID, Tool Type, Status, Timestamp).
   - Change the unlock price dynamically across the platform.

---

## 12. How to Run Tests

FunReveal includes an automated test suite with **51 unit and security tests**:

```bash
npm test
```

### What is tested:
- **Calculator Utilities**: SHA-256 determinism, bounded hashing, canonical name sorting.
- **7 Calculation Engines**: Value ranges, deterministic replay, quiz scoring algorithms.
- **Input Validation**: Zod schemas, boundary tests, name length restrictions, missing quiz answers.
- **Payment Security**:
  - Valid HMAC-SHA256 signature verification.
  - Rejection of tampered `order_id` or `payment_id`.
  - Rejection of forged signature strings.
  - Webhook payload signature verification and tampering rejection.

---

## 13. Deployment Instructions (Vercel)

1. Push your code to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com) and click **Add New** → **Project**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - `DATABASE_URL` (from Neon, Supabase, etc.)
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `AUTH_SECRET`
   - `APP_URL` (e.g. `https://your-domain.vercel.app`)
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `DEFAULT_TOOL_PRICE_PAISE` (`500`)
5. Click **Deploy**.
6. After deployment completes, run database migrations and seeding using the Prisma CLI:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
7. In your Razorpay Dashboard, add your production webhook URL:
   `https://your-domain.vercel.app/api/webhooks/razorpay`

---

## 14. Production Security Checklist

- [x] **No Client-Side Source of Truth**: Payments are validated and verified strictly on the server using cryptographic HMAC-SHA256 checks.
- [x] **Zero Plaintext Secrets**: Secrets (`RAZORPAY_KEY_SECRET`, `AUTH_SECRET`) are never bundled in client assets or exposed in network payloads.
- [x] **Locked Result Privacy**: Server-side route handler `/api/session/[id]` strictly omits `resultData` if status is not `PAID`.
- [x] **PII Protection**: Inputs are hashed with SHA-256. Raw names and birthdates are never logged or stored permanently.
- [x] **Tampering Prevention**: Price is determined server-side from configuration/database; client cannot submit an arbitrary price.
- [x] **Replay & Idempotency**: Webhook events check for unique `razorpayEventId` to prevent double processing.
- [x] **Secure Headers**: Strict security headers configured in `next.config.ts` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`).
- [x] **Protected Admin Routes**: Protected with NextAuth.js JWT session verification and password hashing via `bcryptjs` (salt rounds: 12).

---

## 15. Troubleshooting Guide

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `RAZORPAY_CONFIG_REQUIRED` error on unlock | Placeholder keys in `.env` | Add real Razorpay Test or Live keys to `.env` and restart dev server |
| `Can't reach database server` | PostgreSQL is not running or URL is wrong | Verify `DATABASE_URL` credentials or check network connectivity to your cloud DB |
| Result appears locked after payment | Signature mismatch or test interrupted | Check server console logs; ensure `RAZORPAY_KEY_SECRET` matches your Razorpay dashboard |
| Admin login fails | Incorrect email/password or database not seeded | Run `npm run db:seed` to seed default credentials |
| Port 3000 in use | Another process running on port 3000 | Run `npx kill-port 3000` or start with `npm run dev -- -p 3001` |

---

*Made with 💜 for entertainment.*
