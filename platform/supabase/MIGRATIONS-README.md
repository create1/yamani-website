# Database migrations — no more copy-paste

After you do the **one-time link** below, any new migration is applied by running one command. No SQL Editor, no copy-paste.

---

## One-time setup: link this repo to your Supabase project

1. **Get your project ref**  
   Supabase Dashboard → your project (the one connected to Vercel) → **Project Settings** → **General** → copy **Reference ID** (e.g. `abcdefghijklmnop`).

2. **From the `platform` folder**, run:
   ```bash
   npx supabase link --project-ref YOUR_REF
   ```
   When prompted, enter your **database password** (Project Settings → Database → Database password, or reset it there).

3. Done. The link is stored locally (not committed). From now on, migrations run with one command.

---

## When we add a new field or table

New changes live in **migration files** in `supabase/migrations/` (e.g. `20240305100000_add_my_field.sql`). To apply them to your **linked** Supabase project:

```bash
cd platform
npm run db:push
```

That’s it. No opening Supabase SQL Editor or pasting SQL.

- **Who runs it:** You or the AI can run `npm run db:push` after new migrations are added.
- **Where it applies:** It applies to whichever project you linked in the one-time setup (usually production).

---

## If you already ran the big SQL file in the SQL Editor

Supabase tracks which migrations have been applied. If you applied the schema manually, mark the existing migrations as applied so `db push` won’t try to run them again:

```bash
cd platform
npx supabase migration repair 20240303000000 20240303000001 20240303100000 --status applied --linked
```

(Use your project’s DB password if prompted.) After that, only **new** migration files will run when you `npm run db:push`.

---

## If you never link (or prefer SQL Editor)

You can still run the SQL in Supabase Dashboard → SQL Editor when we add a new migration. We can also keep providing a combined `RUN_IN_SUPABASE_SQL_EDITOR.sql` for one-off use if you prefer.
