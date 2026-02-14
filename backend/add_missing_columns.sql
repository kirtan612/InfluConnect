-- Add missing columns to influencer_profiles table
-- Run this SQL script in your PostgreSQL database

-- Add profile_image_url column
ALTER TABLE influencer_profiles 
ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500);

-- Add cover_image_url column
ALTER TABLE influencer_profiles 
ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(500);

-- Add social_links column (JSON)
ALTER TABLE influencer_profiles 
ADD COLUMN IF NOT EXISTS social_links JSON;

-- Add platforms column (JSON with default empty array)
ALTER TABLE influencer_profiles 
ADD COLUMN IF NOT EXISTS platforms JSON DEFAULT '[]'::json;

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'influencer_profiles'
ORDER BY ordinal_position;
