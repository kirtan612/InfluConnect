-- Add enhanced fields to reports table for agreement/dispute reporting
-- Run this SQL script to update the reports table

-- Add reported_by field
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS reported_by INTEGER NOT NULL DEFAULT 1;

-- Add description field
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS description VARCHAR(2000) NULL;

-- Add reviewed_by field
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS reviewed_by INTEGER NULL;

-- Add reviewed_at field
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP NULL;

-- Add foreign keys
ALTER TABLE reports 
ADD CONSTRAINT fk_reports_reported_by 
FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE reports 
ADD CONSTRAINT fk_reports_reviewed_by 
FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reports_reported_by ON reports(reported_by);
CREATE INDEX IF NOT EXISTS idx_reports_entity_type ON reports(reported_entity_type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'reports'
ORDER BY ordinal_position;
