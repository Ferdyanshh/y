const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 5000;

const dbConfig = {
    host: 'diet-app-db',
    user: 'root',
    password: 'password',
    database: 'health_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
let db;

async function connectWithRetry() {
    const maxRetries = 10;
    const delay = 5000;

    for (let i = 1; i <= maxRetries; i++) {
        try {
            console.log(`⏳ Mencoba koneksi ke database (Percobaan ${i}/${maxRetries})...`);

            db = await mysql.createPool(dbConfig);

            await db.getConnection(); 
            
            console.log('✅ Berhasil terhubung ke MySQL Database!');
            return true;

        } catch (err) {
            console.error(`Gagal koneksi: ${err.message}`);
            
            if (i < maxRetries) {
                console.log(`...Menunggu ${delay/1000} detik sebelum mencoba lagi...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                console.error('Gagal total setelah percobaan maksimal. Mematikan server.');
                process.exit(1);
            }
        }
    }
}

(async () => {
    await connectWithRetry();

    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('API is running and DB is connected!');
    });

    app.get('/users', async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM users'); 
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})();