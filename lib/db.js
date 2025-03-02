// import mysql from 'mysql2/promise';

// export async function dbConnect() {
//     const pool = mysql.createPool({
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASS,
//         database: process.env.DB_NAME,
//     });

//     return pool;  // Kembalikan pool koneksi
// }

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10), // Pastikan port berupa angka
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function dbConnect() {
    return pool; // Kembalikan pool koneksi
}
