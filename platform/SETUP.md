# Apotheos Platform — Setup Guide

## Overview

The `platform/` directory is a full-stack Next.js 14 application that powers the Apotheos online learning experience. It runs alongside (and will eventually replace) the static HTML site.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Auth + Database | Supabase |
| Live Video | Daily.co |
| Deployment | Vercel |

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your **Project URL** and **anon public key** from Settings → API
3. Copy your **service_role key** (keep this secret — only used server-side)

---

## Step 2: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Paste and run the contents of `lib/schema.sql`
3. This creates all tables, RLS policies, and the user trigger

---

## Step 3: Configure Environment Variables

Copy `.env.local` and fill in your real values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DAILY_API_KEY=your-daily-api-key
NEXT_PUBLIC_DAILY_DOMAIN=your-domain.daily.co
SEED_SECRET=any-random-secret-string
```

---

## Step 4: Get a Daily.co Account

1. Go to [daily.co](https://daily.co) and create an account (free tier works)
2. Copy your **API Key** from the dashboard
3. Your domain is shown as `youraccount.daily.co`

---

## Step 5: Seed the Courses

After setting env vars, seed all 48 courses into Supabase:

```bash
curl -X POST http://localhost:3000/api/courses/seed \
  -H "Authorization: Bearer YOUR_SEED_SECRET"
```

Or in production:

```bash
curl -X POST https://your-platform.vercel.app/api/courses/seed \
  -H "Authorization: Bearer YOUR_SEED_SECRET"
```

---

## Step 6: Enable Google Auth (Optional)

1. In Supabase dashboard → Authentication → Providers → Google
2. Add your Google OAuth client ID and secret
3. Set the redirect URL in Google Console to: `https://your-project.supabase.co/auth/v1/callback`

---

## Step 7: Deploy to Vercel

```bash
cd platform
npx vercel --prod
```

Set the same environment variables in your Vercel project settings.

---

## Development

```bash
cd platform
npm run dev
# → http://localhost:3000
```

---

## Page Map

| URL | Description |
|-----|-------------|
| `/` | Home / marketing page |
| `/curriculum` | Full curriculum overview |
| `/schedule` | Weekly schedule with rotation |
| `/courses` | Filterable course catalog |
| `/courses/[slug]` | Course detail + enroll |
| `/courses/[slug]/live` | **Live classroom** (video + chat) |
| `/dashboard` | Student dashboard |
| `/auth/signin` | Sign in (password + magic link + Google) |
| `/auth/signup` | Create account |
| `/api/courses/seed` | Seed course data into Supabase |
| `/api/sessions/create` | Create Daily.co room for a session |
| `/api/sessions/token` | Issue Daily.co meeting token |

---

## How the Live Classroom Works

1. **Instructor clicks "Go Live"** → `POST /api/sessions/create` → creates Daily.co room → saves `daily_room_url` + `daily_room_name` to `sessions` table → marks session `status = 'live'`
2. **Students load the classroom page** → fetch session → request a Daily.co meeting token via `POST /api/sessions/token` → embed `<iframe src={roomUrl}?t={token}>` 
3. **Chat** → messages written to Supabase `messages` table → Supabase Realtime subscription pushes new messages to all connected clients in real-time
4. **Session ends** → Daily.co recording webhook (configure in Daily dashboard) can call an API route to save `recording_url` to the session

---

## 6-Week Rotation Logic

The schedule uses a rotation anchor date (`Feb 23, 2026 = Week 0`). Each week's rotation index is: `((weekOffset % 6) + 6) % 6`. Courses with `rotation_week = null` appear every week; courses with `rotation_week = 0–5` appear only in their assigned rotation week.
