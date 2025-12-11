const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Konfigurasi Pool Database
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'health_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Fitur Auto-Connect & Auto-Create Table
const initDatabase = () => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('⏳ Menunggu Database... ' + err.message);
            setTimeout(initDatabase, 5000); // Coba lagi tiap 5 detik
        } else {
            console.log('✅ DATABASE TERHUBUNG!');
            
            // Script SQL untuk buat tabel User otomatis
            const sqlCreateUser = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            connection.query(sqlCreateUser, (err) => {
                if (err) console.error("❌ Gagal buat tabel users:", err);
                else console.log("📦 Tabel 'users' siap digunakan.");
            });

            connection.release();
        }
    });
};

initDatabase();

module.exports = db;