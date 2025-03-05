import mysql from 'mysql2/promise';

let pool;

export async function dbConnect() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }
    return pool;
}