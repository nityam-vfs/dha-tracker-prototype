# VFS Visa / Permit Verification Portal (DHA Prototype)

A production-style prototype for verifying the status of DHA visa and permit
applications submitted through VFS Global. Built with **Next.js (App Router)**,
**Node.js API routes**, optional **Supabase**, and plain CSS using VFS branding.

> Runs locally with **zero database setup** thanks to built-in mock data.
> Plug in Supabase later with two environment variables.

---

## ✨ Features

- **Simulated auth** — Email + OTP login (OTP is hardcoded `123456`), session stored in `localStorage`.
- **Login-only home page** — clean centered login card, no marketing content.
- **User categories (backend only)** — every account is `premium` or `standard`. The category is **never shown in the UI**; it only changes behavior:
  - **Premium** — created offline by an admin; validates and views status **for free**.
  - **Standard** — default for self sign-ups; **pays per application searched** ($5 each).
- **Multi-record search** — add multiple passport / VFS-reference pairs in one go.
- **Demo payment** — prefilled card details, simulated processing, payment-completion screen.
- **Order confirmation** — application statuses + a printable-style **invoice** (line items, total, PAID stamp).
- **API routes** — `POST /api/user` (resolve category) and `POST /api/validateApplication`.
- **UX polish** — loading spinners, inline field validation, error alerts, success toast, hover effects.
- VFS branding: Blue `#1E2D6B`, Orange `#F36C21`.

---

## 🔀 User Flows

**Premium** (admin-created): Login → Dashboard → add record(s) → **Validate & View Status** (free, inline).

**Standard** (self sign-up): Login → Dashboard → add record(s) → **Proceed to Payment ($5 × N)** → demo card → **Payment Successful** → **Order Confirmation** (statuses + invoice).

---

## 📁 Folder Structure

```
vfs-tracker/
├── app/
│   ├── api/
│   │   ├── user/route.js                  # POST: get-or-create user, returns category
│   │   └── validateApplication/route.js   # POST: validate passport + vfs_ref
│   ├── dashboard/page.js                  # Multi-record track form (behavior by category)
│   ├── payment/page.js                    # Demo card + payment-completion screen
│   ├── confirmation/page.js               # Statuses + invoice
│   ├── globals.css                        # VFS-branded styles
│   ├── layout.js
│   └── page.js                            # Login-only home page
├── components/
│   ├── ApplicationStatus.js
│   ├── Header.js
│   ├── LoginForm.js
│   ├── StatusBadge.js
│   ├── Toast.js
│   └── TrackForm.js                       # Multi-record entry + branching logic
├── lib/
│   ├── mockData.js                        # Fallback applications + users + price
│   ├── order.js                           # sessionStorage order store (payment flow)
│   ├── session.js                         # localStorage session helpers
│   ├── supabaseClient.js                  # Optional Supabase client
│   └── useRequireAuth.js                  # Client auth guard
├── supabase/schema.sql                    # Optional DB schema + seed
├── .env.example
├── next.config.js
└── package.json
```

---

## 🚀 1. Install Dependencies

```bash
cd vfs-tracker
npm install
```

## ▶️ 2. Run Locally

```bash
npm run dev
```

Open <http://localhost:3000>.

**Demo walkthrough**
1. Enter any email → **Send OTP** → OTP `123456` → **Verify & Continue**.
2. **Standard user** (any normal email): add one or more records, then **Proceed to Payment** → pay with the prefilled demo card → see the confirmation + invoice.
3. **Premium user**: log in as `premium@vfs.com` to validate and view status for **free** (no payment).
4. Demo application records:
   - `P12345` / `VFS001` → Under Process
   - `P99999` / `VFS002` → Approved
   - `P55555` / `VFS003` → Rejected

## 🗄️ 3. (Optional) Connect Supabase

The app uses mock data unless these env vars are set.

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor (creates + seeds tables).
3. Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Restart `npm run dev`.

---

## ☁️ 4. Deploy to Vercel

1. Push this folder to a Git repository.
2. In [Vercel](https://vercel.com), **New Project** → import the repo.
3. Set **Root Directory** to `vfs-tracker` (if the repo root differs).
4. (Optional) Add the two `NEXT_PUBLIC_SUPABASE_*` env vars under **Settings → Environment Variables**.
5. Click **Deploy**. Vercel auto-detects Next.js — no extra config needed.

---

## 🔌 API Reference

### `POST /api/validateApplication`
```json
// request
{ "passport": "P12345", "vfs_ref": "VFS001" }

// success
{ "valid": true, "application": { "passport": "P12345", "vfs_ref": "VFS001", "status": "Under Process", ... } }

// not found
{ "valid": false, "message": "No matching application found." }
```

### `POST /api/user`
```json
{ "email": "you@example.com" }
// → { "ok": true, "email": "you@example.com", "type": "standard" }
// premium@vfs.com → { ..., "type": "premium" }
```

---

## 🧪 Notes & Constraints

- Auth is **simulated** — no real provider, OTP is always `123456`.
- User category (`premium` / `standard`) is backend-only and never shown in the UI.
- Premium users are created **out of band** (seeded in `mockData.js` / the `users` table).
- Payment is **simulated** — no gateway, just a short delay + completion screen. Card details are demo-only; nothing is charged.
- Mock user storage is in-memory and resets on server restart.
- Enable proper Supabase RLS policies before any real use.
