-- Disable Row Level Security on vehicles table to match other tables in the app
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;

-- Disable Row Level Security on vehicle_maintenance table
ALTER TABLE vehicle_maintenance DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can insert their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can update their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can delete their own vehicles" ON vehicles;

DROP POLICY IF EXISTS "Users can view their own maintenance records" ON vehicle_maintenance;
DROP POLICY IF EXISTS "Users can insert their own maintenance records" ON vehicle_maintenance;
DROP POLICY IF EXISTS "Users can update their own maintenance records" ON vehicle_maintenance;
DROP POLICY IF EXISTS "Users can delete their own maintenance records" ON vehicle_maintenance;
