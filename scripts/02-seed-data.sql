-- Seed data for Payal Catering website

-- Insert site settings
INSERT INTO site_settings (key, value_en, value_gu, type) VALUES
('company_name', 'Payal Catering', 'પાયલ કેટરિંગ', 'text'),
('company_tagline', 'Authentic Flavors, Memorable Moments', 'અસલી સ્વાદ, યાદગાર ક્ષણો', 'text'),
('company_description', 'We specialize in traditional Gujarati cuisine and modern catering services for all your special occasions.', 'અમે તમારા તમામ ખાસ પ્રસંગો માટે પરંપરાગત ગુજરાતી ભોજન અને આધુનિક કેટરિંગ સેવાઓમાં વિશેષજ્ઞ છીએ.', 'text'),
('contact_phone', '+91 98765 43210', '+91 98765 43210', 'text'),
('contact_email', 'info@payalcatering.com', 'info@payalcatering.com', 'text'),
('contact_address', '123 Food Street, Ahmedabad, Gujarat 380001', '123 ફૂડ સ્ટ્રીટ, અમદાવાદ, ગુજરાત 380001', 'text');

-- Insert menu categories
INSERT INTO menu_categories (name_en, name_gu, description_en, description_gu, sort_order) VALUES
('Traditional Thali', 'પરંપરાગત થાળી', 'Complete traditional meals with variety of dishes', 'વિવિધ વાનગીઓ સાથે સંપૂર્ણ પરંપરાગત ભોજન', 1),
('Snacks & Starters', 'નાસ્તો અને સ્ટાર્ટર', 'Delicious appetizers and snacks', 'સ્વાદિષ્ટ એપેટાઇઝર અને નાસ્તો', 2),
('Main Course', 'મુખ્ય કોર્સ', 'Hearty main dishes for your events', 'તમારા કાર્યક્રમો માટે હાર્દિક મુખ્ય વાનગીઓ', 3),
('Sweets & Desserts', 'મિઠાઈ અને ડેઝર્ટ', 'Traditional sweets and modern desserts', 'પરંપરાગત મિઠાઈ અને આધુનિક ડેઝર્ટ', 4),
('Beverages', 'પીણાં', 'Refreshing drinks and traditional beverages', 'તાજગીભર્યા પીણાં અને પરંપરાગત પીણાં', 5);

-- Insert sample menu items
INSERT INTO menu_items (category_id, name_en, name_gu, description_en, description_gu, price, is_vegetarian, sort_order) VALUES
((SELECT id FROM menu_categories WHERE name_en = 'Traditional Thali'), 'Gujarati Thali', 'ગુજરાતી થાળી', 'Complete traditional Gujarati meal with dal, sabzi, roti, rice, and sweets', 'દાળ, શાક, રોટી, ભાત અને મિઠાઈ સાથે સંપૂર્ણ પરંપરાગત ગુજરાતી ભોજન', 250.00, true, 1),
((SELECT id FROM menu_categories WHERE name_en = 'Traditional Thali'), 'Kathiyawadi Thali', 'કાઠિયાવાડી થાળી', 'Spicy and flavorful Kathiyawadi style thali', 'મસાલેદાર અને સ્વાદિષ્ટ કાઠિયાવાડી શૈલીની થાળી', 280.00, true, 2),
((SELECT id FROM menu_categories WHERE name_en = 'Snacks & Starters'), 'Dhokla', 'ઢોકળા', 'Soft and spongy steamed gram flour cake', 'નરમ અને સ્પોન્જી બાફેલી બેસન કેક', 80.00, true, 1),
((SELECT id FROM menu_categories WHERE name_en = 'Snacks & Starters'), 'Khandvi', 'ખાંડવી', 'Rolled gram flour snack with mustard seeds', 'સરસવના દાણા સાથે વીંટેલો બેસન નાસ્તો', 100.00, true, 2),
((SELECT id FROM menu_categories WHERE name_en = 'Main Course'), 'Undhiyu', 'ઉંધિયું', 'Traditional mixed vegetable curry', 'પરંપરાગત મિશ્ર શાકભાજીની કરી', 180.00, true, 1),
((SELECT id FROM menu_categories WHERE name_en = 'Sweets & Desserts'), 'Mohanthal', 'મોહનથાળ', 'Traditional gram flour sweet', 'પરંપરાગત બેસન મિઠાઈ', 120.00, true, 1),
((SELECT id FROM menu_categories WHERE name_en = 'Beverages'), 'Chaas', 'છાસ', 'Traditional buttermilk with spices', 'મસાલા સાથે પરંપરાગત છાસ', 40.00, true, 1);

-- Insert sample events
INSERT INTO events (title_en, title_gu, description_en, description_gu, event_date, location_en, location_gu, is_featured) VALUES
('Wedding Catering at Grand Palace', 'ગ્રાન્ડ પેલેસમાં લગ્ન કેટરિંગ', 'Successfully catered a beautiful wedding ceremony with 500+ guests', '500+ મહેમાનો સાથે સુંદર લગ્ન સમારોહની સફળ કેટરિંગ', '2024-01-15', 'Grand Palace, Ahmedabad', 'ગ્રાન્ડ પેલેસ, અમદાવાદ', true),
('Corporate Event at Tech Park', 'ટેક પાર્કમાં કોર્પોરેટ ઇવેન્ટ', 'Provided catering services for a major corporate event', 'મુખ્ય કોર્પોરેટ ઇવેન્ટ માટે કેટરિંગ સેવાઓ પ્રદાન કર���', '2024-02-20', 'Tech Park, Gandhinagar', 'ટેક પાર્ક, ગાંધીનગર', true),
('Birthday Celebration', 'જન્મદિવસ������ ઉજવણી', 'Memorable birthday party catering with traditional sweets', 'પરંપરાગત મિઠાઈઓ સાથે યાદગાર જન્મદિવસ પાર્ટી કેટરિંગ', '2024-03-10', 'Private Residence, Surat', 'ખાનગી નિવાસ, સુરત', false);

-- Insert admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, name) VALUES
('admin@payalcatering.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Admin User');
