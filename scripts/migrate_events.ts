import mysql from 'mysql2/promise';

async function main() {
    const uri = 'mysql://root:@localhost:3306/payalcatering';
    const connection = await mysql.createConnection(uri);
    try {
        await connection.execute('ALTER TABLE events ADD COLUMN images JSON, ADD COLUMN video_url VARCHAR(255);');
        console.log('Successfully altered the events table');
    } catch (error) {
        console.error('Migration failed or already applied:', error);
    } finally {
        await connection.end();
    }
}
main();
