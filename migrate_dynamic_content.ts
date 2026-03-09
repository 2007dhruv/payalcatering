import { db } from './lib/db';

async function migrate() {
    try {
        console.log("Checking for quote_en column...");
        await db.execute("ALTER TABLE events ADD COLUMN quote_en TEXT");
        console.log("Added quote_en.");
    } catch (e: any) {
        if (e.code === 'ER_DUP_FIELDNAME') console.log("quote_en already exists.");
        else console.error(e);
    }

    try {
        await db.execute("ALTER TABLE events ADD COLUMN quote_gu TEXT");
        console.log("Added quote_gu.");
    } catch (e: any) {
        if (e.code === 'ER_DUP_FIELDNAME') console.log("quote_gu already exists.");
        else console.error(e);
    }

    try {
        await db.execute("ALTER TABLE events ADD COLUMN menu_highlights JSON");
        console.log("Added menu_highlights.");
    } catch (e: any) {
        if (e.code === 'ER_DUP_FIELDNAME') console.log("menu_highlights already exists.");
        else console.error(e);
    }

    console.log("Migration complete.");
    process.exit(0);
}

migrate();
