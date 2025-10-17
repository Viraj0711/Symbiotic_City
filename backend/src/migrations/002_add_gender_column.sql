-- Add gender column to users table
-- Migration 002: Add gender support

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS gender VARCHAR(20) 
DEFAULT 'prefer-not-to-say' 
CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say'));

-- Update existing users to have default gender value
UPDATE users 
SET gender = 'prefer-not-to-say' 
WHERE gender IS NULL;
