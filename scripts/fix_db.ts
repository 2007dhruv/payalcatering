import { db } from "../lib/db";

async function fixDatabase() {
    console.log("Checking database schema...");

    try {
        // MySQL compatible schema for photos table
        const createPhotosTable = `
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
    `;

        console.log("Creating photos table (if missing)...");
        await db.execute(createPhotosTable);
        console.log("✅ Photos table ready.");

        // Also check if contact_inquiries has necessary columns (just in case)
        // MySQL syntax for adding columns if they don't exist is a bit verbose, 
        // but the error was specifically about the 'photos' table.

        console.log("Database schema fix completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error fixing database:", error);
        process.exit(1);
    }
}

fixDatabase();
