-- Add missing columns to health_records table
ALTER TABLE health_records 
ADD COLUMN IF NOT EXISTS blood_pressure_systolic INTEGER,
ADD COLUMN IF NOT EXISTS blood_pressure_diastolic INTEGER,
ADD COLUMN IF NOT EXISTS blood_sugar NUMERIC,
ADD COLUMN IF NOT EXISTS temperature NUMERIC,
ADD COLUMN IF NOT EXISTS weight NUMERIC,
ADD COLUMN IF NOT EXISTS steps INTEGER,
ADD COLUMN IF NOT EXISTS distance NUMERIC;

-- Fixed missing ALTER TABLE statement for medications
-- Add missing columns to medications table  
ALTER TABLE medications
ADD COLUMN IF NOT EXISTS medical_expense NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS medication_expense NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Add missing columns to vehicle_maintenance table
ALTER TABLE vehicle_maintenance
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;
