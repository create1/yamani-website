# Separating the Two Apotheos Sites

This repo contains **two different sites** that should be deployed and accessed separately so they don’t get confused.

---

## 1. The two sites

| Site | Location | What it is | Who uses it |
|------|----------|------------|-------------|
| **Marketing** | Repo **root** | Static HTML/CSS/JS: `index.html`, `curriculum.html`, `calendar.html`, `waitlist.html`, `styles.css`, `script.js`. Nav: Home, Mission, Model, Curriculum, Schedule, Programs, Membership, Impact, Contact, **Join Waitlist**. | Public visitors, no login. |
| **App (platform)** | **`platform/`** folder | Next.js app: Mission, About, Journey, **Sign in**, **Dashboard**, “Create a team experience”. | Logged-in users; all auth and dashboard live here. |

If both are served from the same URL (or Supabase auth is shared without separating URLs), users can end up on the wrong site after login. The fix is to give each site its **own URL** and point auth only at the app.

---

## 2. Recommended setup: two URLs

### A. Two Vercel projects (recommended)

**Step-by-step: Create the two projects**

1. **Marketing site (main domain)**  
   - In [Vercel](https://vercel.com): **Add New** → **Project** → import the same repo.  
   - **Project name:** e.g. `apotheos-marketing`.  
   - **Root Directory:** leave as **`.`** (repo root).  
   - **Framework Preset:** “Other” (no build; Vercel will serve `index.html`, `*.html`, `styles.css`, `script.js` from root).  
   - Deploy. Then **Settings → Domains**: add your main domain (e.g. `apotheos.com` or `www.apotheos.com`).  
   - No environment variables needed. The “Sign in” link in the nav already points to the app URL (see below).

2. **App (dashboard + Journey)**  
   - In Vercel: **Add New** → **Project** → import the **same repo again** (second project).  
   - **Project name:** e.g. `apotheos-app`.  
   - **Root Directory:** set to **`platform`**.  
   - **Framework Preset:** Next.js (auto-detected). Build command `npm run build`, output `.next`.  
   - **Settings → Environment Variables:** add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` for Production (and Preview if you use branch previews).  
   - **Settings → Domains:** add your app domain (e.g. `app.apotheos.com`). You can use the default `*.vercel.app` URL until the custom domain is ready.  
   - This is the **only** project that runs Supabase auth; redirect users here for sign-in and dashboard.

### B. Supabase Auth: point only at the app

In **Supabase Dashboard → Authentication → URL Configuration**:

- **Site URL:** `https://app.apotheos.com` (your app URL; no trailing slash).
- **Redirect URLs:** add:
  - `https://app.apotheos.com/auth/callback`
  - `https://app.apotheos.com/**`  
  (Add production and preview app URLs if you use them.)

Do **not** add the marketing site URL (e.g. `https://apotheos.com`) to Redirect URLs for auth. All sign-in and OAuth should complete on the app domain.

### C. Marketing site: link “Sign in” to the app

The marketing pages (`index.html`, `curriculum.html`, `calendar.html`) already include a **“Sign in”** link that goes to `https://app.apotheos.com/auth/signin` (opens in a new tab).  

- If your app is on a different URL (e.g. `https://apotheos-app.vercel.app` before you add `app.apotheos.com`), do a find-and-replace in the repo root: replace `https://app.apotheos.com` with your actual app URL.  
- Do **not** implement Supabase auth on the marketing site; all login and redirects stay on the app.

Result:

- **Marketing:** `apotheos.com` → static site, waitlist, no login.  
- **App:** `app.apotheos.com` → sign-in, dashboard, “Create a team experience”.  
- After login, users always land on `app.apotheos.com/dashboard` and never on the marketing site.

---

## 3. If you currently have one Vercel project

- If that project’s **Root Directory** is **empty** (repo root), Vercel is likely building/serving the **marketing** (static) side, and the Next.js app in `platform/` may not be what you see at the main domain.
- To fix:
  - Create a **second** Vercel project.
  - Set its **Root Directory** to **`platform`**.
  - Give it its own domain (e.g. `app.apotheos.com`).
  - In Supabase, set **Site URL** and **Redirect URLs** to that app domain as above.
  - On the marketing site, point “Sign in” / “Dashboard” to the app URL.

---

## 4. Quick checklist

- [ ] Marketing site has its own URL (e.g. `apotheos.com`).  
- [ ] App has its own URL (e.g. `app.apotheos.com`).  
- [ ] Supabase **Site URL** = app URL.  
- [ ] Supabase **Redirect URLs** = app callback (and app `/**` if desired).  
- [ ] Marketing “Sign in” / “Dashboard” links go to `https://app.apotheos.com/...`.  
- [ ] No Supabase auth (no sign-in flow) on the marketing site.

Once this is in place, the two sites are clearly separated and login will always go to the user dashboard on the app.
