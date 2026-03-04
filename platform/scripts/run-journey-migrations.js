#!/usr/bin/env node
/**
 * Run Journey migrations against your Supabase database.
 *
 * DEVELOPMENT (local Supabase):
 *   Add to platform/.env.local: SUPABASE_DB_URL=postgresql://...
 *   Run: npm run db:migrate:journey
 *
 * PRODUCTION (Supabase project used by Vercel):
 *   1. Open the Supabase project that your live app uses.
 *   2. Project Settings → Database → Connection string (URI), Transaction mode, port 6543.
 *   3. Add to platform/.env.production.local (do not commit):
 *      SUPABASE_DB_URL_PRODUCTION=postgresql://postgres.[ref]:[PASSWORD]@...
 *   4. Run: npm run db:migrate:journey:production
 *
 * Or one-off: SUPABASE_DB_URL_PRODUCTION="postgresql://..." npm run db:migrate:journey:production
 */

const fs = require('fs')
const path = require('path')

const isProduction = process.env.DB_TARGET === 'production'
const envPath = isProduction
  ? path.join(__dirname, '../.env.production.local')
  : path.join(__dirname, '../.env.local')
try {
  require('dotenv').config({ path: envPath })
  if (isProduction) require('dotenv').config({ path: path.join(__dirname, '../.env.local') })
} catch (_) {}

const migrationsDir = path.join(__dirname, '../supabase/migrations')
const migrationFiles = [
  '20240303000000_journey_tables.sql',
  '20240303000001_seed_nevada_city_location.sql',
  '20240303100000_journey_participant_count.sql',
]

async function main() {
  const url = isProduction
    ? process.env.SUPABASE_DB_URL_PRODUCTION
    : process.env.SUPABASE_DB_URL
  if (!url || url.includes('YOUR-PASSWORD') || url.includes('your-')) {
    if (isProduction) {
      console.error('Missing SUPABASE_DB_URL_PRODUCTION (production database).')
      console.error('Get the connection string from your PRODUCTION Supabase project (the one Vercel uses).')
      console.error('Dashboard → that project → Project Settings → Database → Connection string (URI).')
      console.error('Add to .env.production.local or run: SUPABASE_DB_URL_PRODUCTION="postgresql://..." npm run db:migrate:journey:production')
    } else {
      console.error('Missing or placeholder SUPABASE_DB_URL.')
      console.error('Get the connection string from Supabase Dashboard → Project Settings → Database → Connection string (URI).')
      console.error('Then run: SUPABASE_DB_URL="postgresql://..." node scripts/run-journey-migrations.js')
    }
    process.exit(1)
  }
  if (isProduction) console.log('Target: PRODUCTION database\n')

  let pg
  try {
    pg = require('pg')
  } catch {
    console.error('Install pg first: npm install pg')
    process.exit(1)
  }

  const client = new pg.Client({ connectionString: url })
  try {
    await client.connect()
    console.log('Connected to database.\n')
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file)
      if (!fs.existsSync(filePath)) {
        console.warn('Skip (not found):', file)
        continue
      }
      const sql = fs.readFileSync(filePath, 'utf8')
      const name = path.basename(file, '.sql')
      console.log('Running:', name, '...')
      await client.query(sql)
      console.log('  OK\n')
    }
    console.log('All Journey migrations applied.')
  } catch (err) {
    console.error('Migration failed:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
