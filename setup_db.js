const mysql = require('mysql2/promise');

async function setup() {
    const uri = 'mysql://root:@localhost:3306/payalcatering';
    const pool = mysql.createPool({ uri });

    try {
        console.log("Creating tables...");
        await pool.execute(`
      CREATE TABLE IF NOT EXISTS material_templates (
        id VARCHAR(36) PRIMARY KEY,
        name_en VARCHAR(255) NOT NULL,
        name_gu VARCHAR(255) NOT NULL,
        base_guest_count INT DEFAULT 100,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

        await pool.execute(`
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
      )
    `);

        console.log("Seeding data...");
        const templateId = 'standard-list';
        await pool.execute(
            "INSERT IGNORE INTO material_templates (id, name_en, name_gu, base_guest_count, description) VALUES (?, ?, ?, ?, ?)",
            [templateId, "Standard Grocery List", "સ્ટાન્ડર્ડ કરિયાણા લિસ્ટ", 100, "Base template for 100 guests"]
        );

        const items = [
            { name_en: "Wheat Flour", name_gu: "ઘઉંનો લોટ", base_quantity: 15, unit_en: "kg", unit_gu: "કિલો" },
            { name_en: "Wheat Flour (Puri)", name_gu: "ઘઉંનો લોટ પુરી", base_quantity: 5, unit_en: "kg", unit_gu: "કિલો" },
            { name_en: "Maida", name_gu: "મેંદો", base_quantity: 5, unit_en: "kg", unit_gu: "કિલો" },
            { name_en: "Bajra Flour", name_gu: "બાજરાનો લોટ", base_quantity: 5, unit_en: "kg", unit_gu: "કિલો" },
            { name_en: "Besan", name_gu: "ચણાનો લોટ", base_quantity: 7, unit_en: "kg", unit_gu: "કિલો" },
            { name_en: "Basmati Rice", name_gu: "ચોખા બાસમતી", base_quantity: 3, unit_en: "kg", unit_gu: "કિલો" },
            { name_en: "Sugar", name_gu: "ખાંડ", base_quantity: 7.5, unit_en: "kg", unit_gu: "કિલો" },
            { name_en: "Jaggery", name_gu: "ગોળ", base_quantity: 2.5, unit_en: "kg", unit_gu: "કિલો" },
            { name_en: "Oil (Tin)", name_gu: "તેલ", base_quantity: 1, unit_en: "tin", unit_gu: "ટીન" },
            { name_en: "Groundnut Oil", name_gu: "સીંગતેલ", base_quantity: 1, unit_en: "tin", unit_gu: "ટીન" },
            { name_en: "Tuvar Dal", name_gu: "તુવેર દાળ", base_quantity: 2, unit_en: "kg", unit_gu: "કિલો" },
            { name_en: "Moong Dal", name_gu: "મગની ફોતરાવાળી દાળ", base_quantity: 1, unit_en: "kg", unit_gu: "કિલો" },
            { name_en: "Salt", name_gu: "નિમક", base_quantity: 2, unit_en: "kg", unit_gu: "કિલો" },
            { name_en: "Mustard Seeds", name_gu: "રાય", base_quantity: 200, unit_en: "g", unit_gu: "ગ્રામ" },
            { name_en: "Red Chili Powder", name_gu: "મરચું", base_quantity: 1, unit_en: "kg", unit_gu: "કિલો" },
            { name_en: "Turmeric Powder", name_gu: "હળદર", base_quantity: 250, unit_en: "g", unit_gu: "ગ્રામ" },
            { name_en: "Coriander Powder", name_gu: "ધાણાજીરું", base_quantity: 500, unit_en: "g", unit_gu: "ગ્રામ" },
        ];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            await pool.execute(
                "INSERT IGNORE INTO material_items (id, template_id, name_en, name_gu, base_quantity, unit_en, unit_gu, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    `item-${i + 1}`,
                    templateId,
                    item.name_en,
                    item.name_gu,
                    item.base_quantity,
                    item.unit_en,
                    item.unit_gu,
                    i
                ]
            );
        }

        console.log("Database setup and seeding completed!");
        process.exit(0);
    } catch (err) {
        console.error("Setup failed:", err);
        process.exit(1);
    }
}

setup();
