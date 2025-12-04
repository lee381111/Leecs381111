-- Add rotation field to business_cards table
ALTER TABLE business_cards
ADD COLUMN IF NOT EXISTS rotation INTEGER DEFAULT 0;

-- Add updated_at field to business_cards table
ALTER TABLE business_cards
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
