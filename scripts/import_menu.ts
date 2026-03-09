import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db } from '../lib/db';

async function importMenu() {
    console.log('Starting menu import...');
    try {
        const filePath = path.join(process.cwd(), 'menu', 'manis_menu.txt');
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        const lines = fileContent.split('\n');

        let currentCategoryEn = '';
        let currentCategoryId = '';
        let categorySortOrder = 1;

        let currentItem: any = null;
        let itemSortOrder = 1;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            if (line.startsWith('## ')) {
                // Save previous item if exists
                if (currentItem) {
                    await insertItem(currentItem, currentCategoryId, itemSortOrder++);
                    currentItem = null;
                }

                currentCategoryEn = line.substring(3).trim();
                console.log(`\nFound Category: ${currentCategoryEn}`);

                // Insert category
                currentCategoryId = crypto.randomUUID();
                // Simple mapping for Gujarati category names (can be improved)
                const categoryGu = currentCategoryEn;

                await db.execute(
                    `INSERT INTO menu_categories 
                    (id, name_en, name_gu, sort_order) 
                    VALUES (?, ?, ?, ?)`,
                    [currentCategoryId, currentCategoryEn, categoryGu, categorySortOrder++]
                );

                itemSortOrder = 1; // Reset item sort order for new category
            } else if (line.startsWith('- Item: ')) {
                if (currentItem) {
                    await insertItem(currentItem, currentCategoryId, itemSortOrder++);
                }

                currentItem = {
                    name_en: line.substring(8).trim(),
                    name_gu: '',
                    desc_en: null,
                    desc_gu: null
                };
            } else if (line.startsWith('Gujarati: ') && currentItem) {
                currentItem.name_gu = line.substring(10).trim();
            } else if (line.startsWith('Description (English): ') && currentItem) {
                const desc = line.substring(23).trim();
                currentItem.desc_en = desc === 'N/A' ? null : desc;
            } else if (line.startsWith('Description (Gujarati): ') && currentItem) {
                const desc = line.substring(24).trim();
                currentItem.desc_gu = desc === 'N/A' ? null : desc;
            }
        }

        // Insert the very last item if exists
        if (currentItem) {
            await insertItem(currentItem, currentCategoryId, itemSortOrder++);
        }

        console.log('\nImport completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Import failed:', error);
        process.exit(1);
    }
}

async function insertItem(item: any, categoryId: string, sortOrder: number) {
    if (!item.name_en) return;

    // Fallback if gujarati name is missing
    if (!item.name_gu) {
        item.name_gu = item.name_en;
    }

    const itemId = crypto.randomUUID();
    console.log(`  Adding Item: ${item.name_en}`);

    await db.execute(
        `INSERT INTO menu_items 
        (id, category_id, name_en, name_gu, description_en, description_gu, sort_order) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [itemId, categoryId, item.name_en, item.name_gu, item.desc_en, item.desc_gu, sortOrder]
    );
}

importMenu();
