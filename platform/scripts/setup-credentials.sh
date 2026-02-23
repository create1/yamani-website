#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Apotheos Platform — Credential Setup Script
# Run this once after you have your Supabase + Daily.co credentials
# Usage: bash scripts/setup-credentials.sh
# ═══════════════════════════════════════════════════════════════
set -e

PLATFORM_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$PLATFORM_DIR/.env.local"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║        APOTHEOS PLATFORM — CREDENTIAL SETUP          ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "You'll need credentials from two services:"
echo "  1. Supabase  → https://supabase.com/dashboard"
echo "  2. Daily.co  → https://dashboard.daily.co"
echo ""

# ── Supabase ──────────────────────────────────────────────────
echo "── SUPABASE ────────────────────────────────────────────"
echo "Go to: https://supabase.com/dashboard → your project → Settings → API"
echo ""
read -p "  SUPABASE_URL (e.g. https://xxxx.supabase.co):  " SUPABASE_URL
read -p "  SUPABASE_ANON_KEY (starts with eyJ...):        " SUPABASE_ANON_KEY
read -p "  SUPABASE_SERVICE_ROLE_KEY (starts with eyJ...): " SUPABASE_SERVICE_ROLE_KEY
echo ""

# ── Daily.co ─────────────────────────────────────────────────
echo "── DAILY.CO ────────────────────────────────────────────"
echo "Go to: https://dashboard.daily.co → Developers → API Keys"
echo ""
read -p "  DAILY_API_KEY:                                  " DAILY_API_KEY
read -p "  DAILY_DOMAIN (e.g. yourcompany.daily.co):       " DAILY_DOMAIN
echo ""

# ── Write .env.local ──────────────────────────────────────────
cat > "$ENV_FILE" <<ENV
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
DAILY_API_KEY=${DAILY_API_KEY}
NEXT_PUBLIC_DAILY_DOMAIN=${DAILY_DOMAIN}
ENV

echo "✓ .env.local written"

# ── Push to Vercel ────────────────────────────────────────────
echo ""
echo "── VERCEL ENV VARS ─────────────────────────────────────"
read -p "Push these to Vercel now? (y/n): " PUSH_VERCEL

if [[ "$PUSH_VERCEL" == "y" || "$PUSH_VERCEL" == "Y" ]]; then
  cd "$PLATFORM_DIR"
  echo "$SUPABASE_URL"          | vercel env add NEXT_PUBLIC_SUPABASE_URL production --force 2>/dev/null || true
  echo "$SUPABASE_ANON_KEY"     | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --force 2>/dev/null || true
  echo "$SUPABASE_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production --force 2>/dev/null || true
  echo "$DAILY_API_KEY"         | vercel env add DAILY_API_KEY production --force 2>/dev/null || true
  echo "$DAILY_DOMAIN"          | vercel env add NEXT_PUBLIC_DAILY_DOMAIN production --force 2>/dev/null || true
  echo "✓ Vercel env vars pushed"
fi

# ── Apply DB schema ───────────────────────────────────────────
echo ""
echo "── DATABASE SCHEMA ─────────────────────────────────────"
echo "Next: apply the database schema to Supabase."
echo ""
read -p "Link this project to Supabase and push schema? (y/n): " PUSH_SCHEMA

if [[ "$PUSH_SCHEMA" == "y" || "$PUSH_SCHEMA" == "Y" ]]; then
  cd "$PLATFORM_DIR"
  # Extract project ref from URL: https://xxxx.supabase.co → xxxx
  PROJECT_REF=$(echo "$SUPABASE_URL" | sed 's|https://||' | sed 's|\.supabase\.co.*||')
  echo "  Project ref: $PROJECT_REF"
  supabase link --project-ref "$PROJECT_REF"
  supabase db push
  echo "✓ Schema applied"
fi

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  Setup complete! Next steps:                         ║"
echo "║  1. Enable Email auth in Supabase Auth settings      ║"
echo "║  2. Optionally enable Google OAuth                   ║"
echo "║  3. Run: cd platform && vercel --prod                ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
