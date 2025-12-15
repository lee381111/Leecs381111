-- Add storage quota and premium status columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS storage_quota BIGINT DEFAULT 52428800, -- 50MB in bytes
ADD COLUMN IF NOT EXISTS storage_used BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS auth_type TEXT DEFAULT 'email', -- 'email' or 'pi'
ADD COLUMN IF NOT EXISTS pi_username TEXT,
ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_auth_type ON profiles(auth_type);
CREATE INDEX IF NOT EXISTS idx_profiles_is_premium ON profiles(is_premium);

-- Add comment for documentation
COMMENT ON COLUMN profiles.storage_quota IS 'Storage quota in bytes. Email users: 524288000 (500MB), Pi free: 52428800 (50MB), Pi premium: 524288000 (500MB)';
COMMENT ON COLUMN profiles.storage_used IS 'Current storage usage in bytes';
COMMENT ON COLUMN profiles.is_premium IS 'Whether user has premium subscription (Pi users only)';
COMMENT ON COLUMN profiles.auth_type IS 'Authentication type: email or pi';
COMMENT ON COLUMN profiles.pi_username IS 'Pi Network username (if auth_type is pi)';
COMMENT ON COLUMN profiles.premium_expires_at IS 'Premium subscription expiry date (Pi users only)';
