-- Enable RLS on all tables and create policies

-- Schedules table
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own schedules" ON schedules;
CREATE POLICY "Users can view their own schedules"
  ON schedules FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own schedules" ON schedules;
CREATE POLICY "Users can insert their own schedules"
  ON schedules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own schedules" ON schedules;
CREATE POLICY "Users can update their own schedules"
  ON schedules FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own schedules" ON schedules;
CREATE POLICY "Users can delete their own schedules"
  ON schedules FOR DELETE
  USING (auth.uid() = user_id);

-- Diaries table
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own diaries" ON diaries;
CREATE POLICY "Users can view their own diaries"
  ON diaries FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own diaries" ON diaries;
CREATE POLICY "Users can insert their own diaries"
  ON diaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own diaries" ON diaries;
CREATE POLICY "Users can update their own diaries"
  ON diaries FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own diaries" ON diaries;
CREATE POLICY "Users can delete their own diaries"
  ON diaries FOR DELETE
  USING (auth.uid() = user_id);

-- Travel locations table
ALTER TABLE travel_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own travel locations" ON travel_locations;
CREATE POLICY "Users can view their own travel locations"
  ON travel_locations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own travel locations" ON travel_locations;
CREATE POLICY "Users can insert their own travel locations"
  ON travel_locations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own travel locations" ON travel_locations;
CREATE POLICY "Users can update their own travel locations"
  ON travel_locations FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own travel locations" ON travel_locations;
CREATE POLICY "Users can delete their own travel locations"
  ON travel_locations FOR DELETE
  USING (auth.uid() = user_id);

-- Radio stations table
ALTER TABLE radio_stations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own radio stations" ON radio_stations;
CREATE POLICY "Users can view their own radio stations"
  ON radio_stations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own radio stations" ON radio_stations;
CREATE POLICY "Users can insert their own radio stations"
  ON radio_stations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own radio stations" ON radio_stations;
CREATE POLICY "Users can update their own radio stations"
  ON radio_stations FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own radio stations" ON radio_stations;
CREATE POLICY "Users can delete their own radio stations"
  ON radio_stations FOR DELETE
  USING (auth.uid() = user_id);

-- Vehicles table
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own vehicles" ON vehicles;
CREATE POLICY "Users can view their own vehicles"
  ON vehicles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own vehicles" ON vehicles;
CREATE POLICY "Users can insert their own vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own vehicles" ON vehicles;
CREATE POLICY "Users can update their own vehicles"
  ON vehicles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own vehicles" ON vehicles;
CREATE POLICY "Users can delete their own vehicles"
  ON vehicles FOR DELETE
  USING (auth.uid() = user_id);

-- Vehicle maintenance table
ALTER TABLE vehicle_maintenance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own vehicle maintenance" ON vehicle_maintenance;
CREATE POLICY "Users can view their own vehicle maintenance"
  ON vehicle_maintenance FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own vehicle maintenance" ON vehicle_maintenance;
CREATE POLICY "Users can insert their own vehicle maintenance"
  ON vehicle_maintenance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own vehicle maintenance" ON vehicle_maintenance;
CREATE POLICY "Users can update their own vehicle maintenance"
  ON vehicle_maintenance FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own vehicle maintenance" ON vehicle_maintenance;
CREATE POLICY "Users can delete their own vehicle maintenance"
  ON vehicle_maintenance FOR DELETE
  USING (auth.uid() = user_id);

-- Health records table
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own health records" ON health_records;
CREATE POLICY "Users can view their own health records"
  ON health_records FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own health records" ON health_records;
CREATE POLICY "Users can insert their own health records"
  ON health_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own health records" ON health_records;
CREATE POLICY "Users can update their own health records"
  ON health_records FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own health records" ON health_records;
CREATE POLICY "Users can delete their own health records"
  ON health_records FOR DELETE
  USING (auth.uid() = user_id);

-- Medications table
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own medications" ON medications;
CREATE POLICY "Users can view their own medications"
  ON medications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own medications" ON medications;
CREATE POLICY "Users can insert their own medications"
  ON medications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own medications" ON medications;
CREATE POLICY "Users can update their own medications"
  ON medications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own medications" ON medications;
CREATE POLICY "Users can delete their own medications"
  ON medications FOR DELETE
  USING (auth.uid() = user_id);

-- Medication logs table
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own medication logs" ON medication_logs;
CREATE POLICY "Users can view their own medication logs"
  ON medication_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own medication logs" ON medication_logs;
CREATE POLICY "Users can insert their own medication logs"
  ON medication_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own medication logs" ON medication_logs;
CREATE POLICY "Users can update their own medication logs"
  ON medication_logs FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own medication logs" ON medication_logs;
CREATE POLICY "Users can delete their own medication logs"
  ON medication_logs FOR DELETE
  USING (auth.uid() = user_id);
