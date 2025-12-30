const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'health_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const initDatabase = () => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Menunggu Database... ' + err.message);
            setTimeout(initDatabase, 5000); 
        } else {
            console.log('DATABASE TERHUBUNG!');
            const sqlCreateUser = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    target_weight DECIMAL(5,2) DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            const sqlCreateWeightLogs = `
                CREATE TABLE IF NOT EXISTS weight_logs (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    weight DECIMAL(5,2) NOT NULL,
                    date DATE NOT NULL,
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `;

            connection.query(sqlCreateUser, (err) => {
                if (err) console.error("Gagal tabel users:", err);
                else {
                    console.log("Tabel 'users' siap/sudah ada.");

                    connection.query("SHOW COLUMNS FROM users LIKE 'target_weight'", (err, res) => {
                        if (!err && res.length === 0) {
                            connection.query("ALTER TABLE users ADD COLUMN target_weight DECIMAL(5,2) DEFAULT 0", () => {
                                console.log("mw🔧 Kolom 'target_weight' berhasil ditambahkan otomatis.");
                            });
                        }
                    });

                    connection.query(sqlCreateWeightLogs, (err) => {
                        if (err) console.error("Gagal tabel weight_logs:", err);
                        else console.log("Tabel 'weight_logs' siap/sudah ada.");
                    });
                }
            });

            connection.release();
        }
    });
};

initDatabase();

module.exports = db;