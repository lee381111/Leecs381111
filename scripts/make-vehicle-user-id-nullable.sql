-- Make user_id column nullable in vehicles and vehicle_maintenance tables
-- This allows the app to work without authentication, matching other sections

ALTER TABLE vehicles ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE vehicle_maintenance ALTER COLUMN user_id DROP NOT NULL;
