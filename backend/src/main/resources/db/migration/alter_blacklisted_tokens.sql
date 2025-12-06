-- Alter blacklisted_tokens table to use TEXT for token column
-- This allows storing longer JWT tokens

-- Drop index before altering column
DROP INDEX IF EXISTS idx_token ON blacklisted_tokens;

-- Alter column type to TEXT
ALTER TABLE blacklisted_tokens 
MODIFY COLUMN token TEXT NOT NULL;

-- Recreate index (note: TEXT columns in MySQL need a prefix length for indexes)
CREATE INDEX idx_token ON blacklisted_tokens(token(255));
