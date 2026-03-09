-- Add new columns to contact_inquiries table for custom menu requests
ALTER TABLE contact_inquiries
ADD COLUMN type TEXT DEFAULT 'general', -- 'general' or 'custom_menu'
ADD COLUMN selected_menu_items JSONB, -- Stores an array of selected menu item IDs and details
ADD COLUMN event_address TEXT,
ADD COLUMN event_time TEXT;

-- Update existing inquiries to 'general' type
UPDATE contact_inquiries
SET type = 'general'
WHERE type IS NULL;
