import fs from 'fs';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

async function migrateMenu() {
    const uri = process.env.MYSQL_URI || 'mysql://root:@localhost:3306/payalcatering';
    const connection = await mysql.createConnection({
        uri,
        multipleStatements: true
    });

    try {
        console.log('Connecting to database...');

        // First let's check if there are foreign key constraints issues when deleting.
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        await connection.execute('TRUNCATE TABLE menu_items');
        await connection.execute('TRUNCATE TABLE menu_categories');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Cleared existing menu data.');

        const fileContent = fs.readFileSync('menubydev.txt', 'utf-8');
        const lines = fileContent.split('\n');

        let currentCategoryId = null;
        let categoryOrder = 0;
        let itemOrder = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            if (line.includes('Gujarati Name\tEnglish Name')) {
                continue; // Skip header rows
            }

            // Feature: Identify category line vs Item line
            // Categories typically don't have tabs and have parentheses.
            if (!line.includes('\t')) {
                categoryOrder++;
                currentCategoryId = crypto.randomUUID();
                itemOrder = 0;

                const match = line.match(/(.*)\((.*)\)/);
                let nameEn = line;
                let nameGu = line;

                if (match) {
                    // Remove emojis from English name
                    nameEn = match[1].replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200d\uFE0F]/gu, '').trim();
                    nameGu = match[2].trim();
                } else {
                    nameEn = line.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200d\uFE0F]/gu, '').trim();
                }

                await connection.execute(
                    'INSERT INTO menu_categories (id, name_en, name_gu, sort_order) VALUES (?, ?, ?, ?)',
                    [currentCategoryId, nameEn, nameGu, categoryOrder]
                );
                console.log(`Inserted Category: ${nameEn} (${nameGu})`);
            } else if (line.includes('\t') && currentCategoryId) {
                itemOrder++;
                const parts = line.split('\t');

                // There might be extra tabs or missing columns
                if (parts.length >= 4) {
                    const nameGu = parts[0].trim();
                    const nameEn = parts[1].trim();
                    const descGu = parts[2].trim();
                    const descEn = parts[3].trim();

                    const itemId = crypto.randomUUID();
                    await connection.execute(
                        'INSERT INTO menu_items (id, category_id, name_en, name_gu, description_en, description_gu, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        [itemId, currentCategoryId, nameEn, nameGu, descEn, descGu, itemOrder]
                    );
                } else if (parts.length === 2) {
                    // Fallback if some rows miss description
                    const nameGu = parts[0].trim();
                    const nameEn = parts[1].trim();
                    const itemId = crypto.randomUUID();
                    await connection.execute(
                        'INSERT INTO menu_items (id, category_id, name_en, name_gu, description_en, description_gu, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        [itemId, currentCategoryId, nameEn, nameGu, '', '', itemOrder]
                    );
                }
            }
        }
        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

migrateMenu();
