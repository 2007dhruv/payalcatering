-- MySQL Setup for Payal Catering

-- Create tables

CREATE TABLE IF NOT EXISTS menu_categories (
  id VARCHAR(36) PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_gu VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_gu TEXT,
  image_url VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
  id VARCHAR(36) PRIMARY KEY,
  category_id VARCHAR(36),
  name_en VARCHAR(255) NOT NULL,
  name_gu VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_gu TEXT,
  image_url VARCHAR(255),
  is_vegetarian BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(36) PRIMARY KEY,
  title_en VARCHAR(255) NOT NULL,
  title_gu VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_gu TEXT,
  image_url VARCHAR(255),
  event_date DATE,
  location_en VARCHAR(255),
  location_gu VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  event_type VARCHAR(100),
  event_date DATE,
  guest_count INT,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  type VARCHAR(50) DEFAULT 'general',
  selected_menu_items JSON,
  event_address TEXT,
  event_time VARCHAR(100),
  event_time_custom VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS photos (
  id VARCHAR(36) PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size INT,
  mime_type VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_photos_category (category),
  INDEX idx_photos_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS material_templates (
  id VARCHAR(36) PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_gu VARCHAR(255) NOT NULL,
  base_guest_count INT DEFAULT 100,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS material_items (
  id VARCHAR(36) PRIMARY KEY,
  template_id VARCHAR(36),
  name_en VARCHAR(255) NOT NULL,
  name_gu VARCHAR(255) NOT NULL,
  base_quantity DECIMAL(10, 2) NOT NULL,
  unit_en VARCHAR(50) NOT NULL,
  unit_gu VARCHAR(50) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES material_templates(id) ON DELETE CASCADE
);
