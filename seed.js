const mysql = require('mysql2/promise');
const crypto = require('crypto');

const uri = 'mysql://root:@localhost:3306/payalcatering';

async function seed() {
    const pool = mysql.createPool({ uri });
    const templateId = 'standard-list';
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
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

        console.log("Seeding completed!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seed();
