-- Add Agreement and Dispute Management fields to campaigns table
-- Run this SQL script to add the new columns

-- Agreement acceptance fields
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS brand_accepted_terms BOOLEAN DEFAULT FALSE NOT NULL;

ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS brand_accepted_at TIMESTAMP NULL;

ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS influencer_accepted_terms BOOLEAN DEFAULT FALSE NOT NULL;

ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS influencer_accepted_at TIMESTAMP NULL;

-- Dispute management fields
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS dispute_count INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS dispute_reason VARCHAR(1000) NULL;

ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS admin_decision VARCHAR(1000) NULL;

ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS admin_decided_at TIMESTAMP NULL;

ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS admin_decided_by INTEGER NULL;

-- Add foreign key for admin_decided_by
ALTER TABLE campaigns 
ADD CONSTRAINT fk_campaigns_admin_decided_by 
FOREIGN KEY (admin_decided_by) REFERENCES users(id) ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_accepted ON campaigns(brand_accepted_terms);
CREATE INDEX IF NOT EXISTS idx_campaigns_influencer_accepted ON campaigns(influencer_accepted_terms);
CREATE INDEX IF NOT EXISTS idx_campaigns_dispute_count ON campaigns(dispute_count);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

-- Update existing campaigns to have default values
UPDATE campaigns 
SET 
    brand_accepted_terms = FALSE,
    influencer_accepted_terms = FALSE,
    dispute_count = 0
WHERE brand_accepted_terms IS NULL 
   OR influencer_accepted_terms IS NULL 
   OR dispute_count IS NULL;

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'campaigns'
AND column_name IN (
    'brand_accepted_terms', 
    'brand_accepted_at', 
    'influencer_accepted_terms', 
    'influencer_accepted_at',
    'dispute_count',
    'dispute_reason',
    'admin_decision',
    'admin_decided_at',
    'admin_decided_by'
)
ORDER BY ordinal_position;
