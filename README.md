# VFS Application Tracker (DHA Prototype)

A production-style prototype for tracking DHA visa applications submitted through
VFS Global. Built with **Next.js (App Router)**, **Node.js API routes**, optional
**Supabase**, and plain CSS using VFS branding.

> Runs locally with **zero database setup** thanks to built-in mock data.
> Plug in Supabase later with two environment variables.

---

## ✨ Features

- **Simulated auth** — Email + OTP login (OTP is hardcoded `123456`), session stored in `localStorage`.
- **Sign-up** — New emails stored in Supabase (or in-memory mock).
- **Landing page** — Corporate hero + “Track Your Application” CTA + centered login card.
- **Dashboard** — Two workflows: Paid Customer & Subscribed Customer.
- **Paid flow** — Validate → simulate payment → view status.
- **Subscribed flow** — Validate → view status immediately.
- **API route** — `POST /api/validateApplication` validates passport + VFS reference.
- **UX polish** — Loading spinners, inline field validation, error alerts, success toast, hover effects.
- VFS branding: Blue `#1E2D6B`, Orange `#F36C21`.

---

## 📁 Folder Structure

```
vfs-tracker/
├── app/
│   ├── api/
│   │   ├── validateApplication/route.js   # POST: validate passport + vfs_ref
│   │   └── signup/route.js                # POST: register new user
│   ├── dashboard/page.js                  # Paid vs Subscribed choice
│   ├── paid/page.js                       # Paid flow
│   ├── subscribed/page.js                 # Subscribed flow
│   ├── globals.css                        # VFS-branded styles
│   ├── layout.js
│   └── page.js                            # Landing + login
├── components/
│   ├── ApplicationForm.js                 # Shared lookup form (paid/subscribed)
│   ├── ApplicationStatus.js
│   ├── Header.js
│   ├── LoginForm.js
│   ├── StatusBadge.js
│   └── Toast.js
├── lib/
│   ├── mockData.js                        # Fallback applications + users
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
1. On the landing page, enter any email → **Send OTP**.
2. Enter OTP `123456` → **Verify & Continue**.
3. Choose **Paid** or **Subscribed**.
4. Use a demo record:
   - `P12345` / `VFS001` → Under Process
   - `P99999` / `VFS002` → Approved
   - `P55555` / `VFS003` → Rejected
5. Paid flow adds a simulated **Proceed to Payment** step before showing status.

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

### `POST /api/signup`
```json
{ "email": "you@example.com" }   // → { "ok": true, "email": "you@example.com" }
```

---

## 🧪 Notes & Constraints

- Auth is **simulated** — no real provider, OTP is always `123456`.
- Payment is **simulated** — no gateway, just a 1.2s delay + success toast.
- Mock sign-up storage is in-memory and resets on server restart.
- Enable proper Supabase RLS policies before any real use.
