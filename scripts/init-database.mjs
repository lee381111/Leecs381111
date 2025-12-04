import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function initDatabase() {
  console.log('[v0] Starting database initialization...')

  // Create schedules table
  const { error: schedulesError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS schedules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        date DATE NOT NULL,
        time TEXT,
        alarm BOOLEAN DEFAULT false,
        completed BOOLEAN DEFAULT false,
        attachments JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id);
      CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(date);

      ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Users can view their own schedules" ON schedules;
      CREATE POLICY "Users can view their own schedules" ON schedules
        FOR SELECT USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can insert their own schedules" ON schedules;
      CREATE POLICY "Users can insert their own schedules" ON schedules
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can update their own schedules" ON schedules;
      CREATE POLICY "Users can update their own schedules" ON schedules
        FOR UPDATE USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can delete their own schedules" ON schedules;
      CREATE POLICY "Users can delete their own schedules" ON schedules
        FOR DELETE USING (auth.uid() = user_id);
    `
  })

  if (schedulesError) {
    console.error('[v0] Error creating schedules table:', schedulesError)
  } else {
    console.log('[v0] Schedules table created successfully')
  }

  // Create notes table
  const { error: notesError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT,
        is_locked BOOLEAN DEFAULT false,
        password TEXT,
        attachments JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);

      ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Users can view their own notes" ON notes;
      CREATE POLICY "Users can view their own notes" ON notes
        FOR SELECT USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can insert their own notes" ON notes;
      CREATE POLICY "Users can insert their own notes" ON notes
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can update their own notes" ON notes;
      CREATE POLICY "Users can update their own notes" ON notes
        FOR UPDATE USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can delete their own notes" ON notes;
      CREATE POLICY "Users can delete their own notes" ON notes
        FOR DELETE USING (auth.uid() = user_id);
    `
  })

  if (notesError) {
    console.error('[v0] Error creating notes table:', notesError)
  } else {
    console.log('[v0] Notes table created successfully')
  }

  // Create diaries table
  const { error: diariesError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS diaries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        weather_emoji TEXT,
        mood_emoji TEXT,
        content TEXT,
        password TEXT,
        attachments JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_diaries_user_id ON diaries(user_id);
      CREATE INDEX IF NOT EXISTS idx_diaries_date ON diaries(date);

      ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Users can view their own diaries" ON diaries;
      CREATE POLICY "Users can view their own diaries" ON diaries
        FOR SELECT USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can insert their own diaries" ON diaries;
      CREATE POLICY "Users can insert their own diaries" ON diaries
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can update their own diaries" ON diaries;
      CREATE POLICY "Users can update their own diaries" ON diaries
        FOR UPDATE USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can delete their own diaries" ON diaries;
      CREATE POLICY "Users can delete their own diaries" ON diaries
        FOR DELETE USING (auth.uid() = user_id);
    `
  })

  if (diariesError) {
    console.error('[v0] Error creating diaries table:', diariesError)
  } else {
    console.log('[v0] Diaries table created successfully')
  }

  // Create travel_locations table
  const { error: travelError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS travel_locations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        travel_date DATE,
        location_type TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        notes TEXT,
        attachments JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_travel_locations_user_id ON travel_locations(user_id);

      ALTER TABLE travel_locations ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Users can view their own travel locations" ON travel_locations;
      CREATE POLICY "Users can view their own travel locations" ON travel_locations
        FOR SELECT USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can insert their own travel locations" ON travel_locations;
      CREATE POLICY "Users can insert their own travel locations" ON travel_locations
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can update their own travel locations" ON travel_locations;
      CREATE POLICY "Users can update their own travel locations" ON travel_locations
        FOR UPDATE USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can delete their own travel locations" ON travel_locations;
      CREATE POLICY "Users can delete their own travel locations" ON travel_locations
        FOR DELETE USING (auth.uid() = user_id);
    `
  })

  if (travelError) {
    console.error('[v0] Error creating travel_locations table:', travelError)
  } else {
    console.log('[v0] Travel locations table created successfully')
  }

  // Create radio_stations table
  const { error: radioError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS radio_stations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_radio_stations_user_id ON radio_stations(user_id);

      ALTER TABLE radio_stations ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Users can view their own radio stations" ON radio_stations;
      CREATE POLICY "Users can view their own radio stations" ON radio_stations
        FOR SELECT USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can insert their own radio stations" ON radio_stations;
      CREATE POLICY "Users can insert their own radio stations" ON radio_stations
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can update their own radio stations" ON radio_stations;
      CREATE POLICY "Users can update their own radio stations" ON radio_stations
        FOR UPDATE USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can delete their own radio stations" ON radio_stations;
      CREATE POLICY "Users can delete their own radio stations" ON radio_stations
        FOR DELETE USING (auth.uid() = user_id);
    `
  })

  if (radioError) {
    console.error('[v0] Error creating radio_stations table:', radioError)
  } else {
    console.log('[v0] Radio stations table created successfully')
  }

  console.log('[v0] Database initialization complete!')
}

initDatabase().catch(console.error)
