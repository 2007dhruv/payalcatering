import mysql from 'mysql2/promise';

const uri = process.env.MYSQL_URI || 'mysql://root:@localhost:3306/payalcatering';

const pool = mysql.createPool({
  uri,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Required for DigitalOcean Managed MySQL
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

export const db = pool;
