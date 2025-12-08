-- Add pi_username column to profiles table for Pi Network users

-- Add pi_username column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'pi_username'
  ) THEN
    ALTER TABLE profiles ADD COLUMN pi_username TEXT;
  END IF;
END $$;

-- Create index for faster Pi username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_pi_username ON profiles(pi_username);
