-- Get the ID for the 'Cold Appetizers' category
DO $$
DECLARE
    cold_appetizers_category_id uuid;
BEGIN
    SELECT id INTO cold_appetizers_category_id FROM public.menu_categories WHERE name_en = 'Cold Appetizers';

    -- Insert new menu items into the 'menu_items' table
    INSERT INTO public.menu_items (name_en, name_gu, description_en, description_gu, category_id, is_available, is_vegetarian, sort_order)
    VALUES
    ('Ganga Jamuna Juice', 'ગંગા જમુના જયુશ', 'A refreshing mix of orange and sweet lime juice.', 'નારંગી અને મીઠા લીંબુના રસનું તાજગીભર્યું મિશ્રણ.', cold_appetizers_category_id, TRUE, TRUE, 10),
    ('Watermelon Juice', 'તરબુચ જયુશ', 'Cool and hydrating juice made from fresh watermelon.', 'તાજા તરબૂચમાંથી બનાવેલો ઠંડો અને હાઇડ્રેટિંગ જયુશ.', cold_appetizers_category_id, TRUE, TRUE, 11),
    ('Fanta with Ice Cream', 'ફેન્ટા વીથ આઈસ્ક્રીમ', 'Fizzy orange drink served with a scoop of creamy ice cream.', 'ફીઝી ફેન્ટા સાથે મીઠી આઈસ્ક્રીમનો મઝેદાર કોંબિનેશન.', cold_appetizers_category_id, TRUE, TRUE, 12),
    ('Green Hariyali Juice', 'ગ્રીન હરીયાલી જયુશ', 'Herbal green juice made with mint, coriander, and lemon.', 'પુદીનો, ધાણા અને લીંબુ સાથે બનાવેલો ઔષધીય લીલો જયુશ.', cold_appetizers_category_id, TRUE, TRUE, 13),
    ('Fruit Punch Juice', 'ફૂટ પંચ જયુશ', 'A sweet and tangy mix of various fruit juices.', 'વિવિધ ફળોના રસનું મીઠું અને ખટ્ટું મિશ્રણ.', cold_appetizers_category_id, TRUE, TRUE, 14),
    ('Apple Juice', 'સફરજન જયુશ', 'Freshly pressed juice made from crisp apples.', 'તાજા અને રસદાર સફરજનમાંથી બનાવેલો જયુશ.', cold_appetizers_category_id, TRUE, TRUE, 15),
    ('Thandai', 'ઠંડાઈ', 'Traditional spiced milk drink with dry fruits and saffron.', 'સૂકા મેવાં અને કેસરવાળું પરંપરાગત ઠંડું દૂધિયું પેય.', cold_appetizers_category_id, TRUE, TRUE, 16),
    ('Jaljeera', 'જલઝીરા', 'Tangy and spicy drink made with cumin and mint.', 'જીરૂં અને પુદીનાથી બનાવેલું ખટ્ટું-મસાલેદાર પીણું.', cold_appetizers_category_id, TRUE, TRUE, 17),
    ('Banana Shake', 'બનાના શેઈક', 'Creamy milkshake made from ripe bananas.', 'પક્વેલા કેળાંથી બનેલું ગાઢ દૂધિયું શેઈક.', cold_appetizers_category_id, TRUE, TRUE, 18),
    ('Chikoo Shake', 'ચીકુ શેઈક', 'A thick milkshake made with sweet chikoo (sapota).', 'મીઠા ચીકુથી બનેલું સ્વાદિષ્ટ શેઈક.', cold_appetizers_category_id, TRUE, TRUE, 19),
    ('Fruit Cocktail Juice', 'ફુટ કોકટેલ જયુશ', 'Blend of seasonal fruits served as a chilled juice.', 'ઋતુસરના ફળોથી બનેલું ઠંડું અને મીઠું મિશ્રિત રસ.', cold_appetizers_category_id, TRUE, TRUE, 20)
    ON CONFLICT (name_en) DO NOTHING;
END $$;
