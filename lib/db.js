// import mysql from 'mysql2/promise';

// export async function dbConnect() {
//     const pool = mysql.createPool({
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASS,
//         database: process.env.DB_NAME,
//     });

//     return pool;
// }

// import mysql from 'mysql2/promise';

// export async function dbConnect() {
//     const pool = mysql.createPool({
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASS,
//         database: process.env.DB_NAME,
//         port: process.env.DB_PORT,
//     });

//     return pool;
// }
import mysql from 'mysql2/promise';

let pool; // Variabel global untuk menyimpan pool koneksi

export async function dbConnect() {
    // Jika pool belum ada, buat pool baru
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,  // Port default jika tidak ada
            waitForConnections: true,
            connectionLimit: 10,  // Maksimal 10 koneksi aktif bersamaan
            queueLimit: 0,        // Tidak ada batas antrian
        });
    }
    return pool;
}
