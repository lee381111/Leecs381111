import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('[v0] Supabase URL:', supabaseUrl ? '✓ Found' : '✗ Missing')
console.log('[v0] Service Key:', supabaseServiceKey ? '✓ Found' : '✗ Missing')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Error: Missing required environment variables')
  console.error('[v0] Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTable(tableName, sql) {
  console.log(`[v0] Creating ${tableName} table...`)
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ query: sql })
    })

    if (!response.ok) {
      const error = await response.text()
      console.log(`[v0] Note: ${tableName} table may already exist or needs manual creation`)
      console.log(`[v0] SQL for ${tableName}:`)
      console.log(sql)
      console.log('')
      return false
    }

    console.log(`[v0] ✓ ${tableName} table created successfully`)
    return true
  } catch (error) {
    console.log(`[v0] Note: Could not create ${tableName} table automatically`)
    console.log(`[v0] SQL for ${tableName}:`)
    console.log(sql)
    console.log('')
    return false
  }
}

async function setupDatabase() {
  console.log('[v0] ========================================')
  console.log('[v0] Starting Database Setup')
  console.log('[v0] ========================================\n')

  const tables = [
    {
      name: 'schedules',
      sql: `
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  alarm BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(date);
      `.trim()
    },
    {
      name: 'notes',
      sql: `
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  is_locked BOOLEAN DEFAULT false,
  password TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `.trim()
    },
    {
      name: 'diaries',
      sql: `
CREATE TABLE IF NOT EXISTS diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TEXT NOT NULL,
  weather_emoji TEXT,
  mood_emoji TEXT,
  content TEXT,
  password TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diaries_date ON diaries(date);
      `.trim()
    },
    {
      name: 'travel_locations',
      sql: `
CREATE TABLE IF NOT EXISTS travel_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date TEXT,
  type TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  notes TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `.trim()
    },
    {
      name: 'radio_stations',
      sql: `
CREATE TABLE IF NOT EXISTS radio_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `.trim()
    }
  ]

  console.log('[v0] Please run the following SQL in your Supabase SQL Editor:')
  console.log('[v0] (Go to https://supabase.com/dashboard → Your Project → SQL Editor)\n')
  console.log('[v0] ========================================\n')

  const allSQL = tables.map(t => t.sql).join('\n\n')
  console.log(allSQL)

  console.log('\n[v0] ========================================')
  console.log('[v0] After running the SQL, type "완료했어요" to continue')
  console.log('[v0] ========================================')
}

setupDatabase()
