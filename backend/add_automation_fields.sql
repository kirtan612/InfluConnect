-- Add new fields to influencer_profiles table for automation tasks
-- Run this SQL script to add the new columns

ALTER TABLE influencer_profiles 
ADD COLUMN IF NOT EXISTS followers INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS engagement_rate FLOAT DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS suspicious_flag BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP NULL;

-- Update existing records with default values
UPDATE influencer_profiles 
SET 
    followers = 0,
    engagement_rate = 0.0,
    suspicious_flag = FALSE
WHERE followers IS NULL OR engagement_rate IS NULL OR suspicious_flag IS NULL;

-- Add indexes for better performance on automation queries
CREATE INDEX IF NOT EXISTS idx_influencer_profiles_trust_score ON influencer_profiles(trust_score);
CREATE INDEX IF NOT EXISTS idx_influencer_profiles_suspicious_flag ON influencer_profiles(suspicious_flag);
CREATE INDEX IF NOT EXISTS idx_influencer_profiles_last_active ON influencer_profiles(last_active);
CREATE INDEX IF NOT EXISTS idx_influencer_profiles_profile_completion ON influencer_profiles(profile_completion);