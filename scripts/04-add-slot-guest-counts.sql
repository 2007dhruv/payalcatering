-- Add slot-specific guest counts for full day menus
ALTER TABLE contact_inquiries 
ADD COLUMN breakfast_count INT DEFAULT 0,
ADD COLUMN lunch_count INT DEFAULT 0,
ADD COLUMN dinner_count INT DEFAULT 0;
