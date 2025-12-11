const express = require('express');
const mysql = require('mysql2/promise'); // Pastikan pakai mysql2/promise agar support async/await
const app = express();
const PORT = 5000;

// Konfigurasi Database (Sesuaikan dengan docker-compose kamu)
const dbConfig = {
    host: 'diet-app-db', // Hostname sesuai nama service di Docker
    user: 'root',
    password: 'password', // Ganti sesuai password kamu
    database: 'health_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Variabel global untuk menyimpan koneksi pool
let db;

// Fungsi untuk connect database dengan fitur Retry (Coba Lagi)
async function connectWithRetry() {
    const maxRetries = 10; // Coba maksimal 10 kali
    const delay = 5000; // Tunggu 5 detik setiap gagal

    for (let i = 1; i <= maxRetries; i++) {
        try {
            console.log(`⏳ Mencoba koneksi ke database (Percobaan ${i}/${maxRetries})...`);
            
            // Mencoba membuat pool koneksi
            db = await mysql.createPool(dbConfig);
            
            // Test koneksi sederhana
            await db.getConnection(); 
            
            console.log('✅ Berhasil terhubung ke MySQL Database!');
            return true; // Keluar dari loop jika sukses

        } catch (err) {
            console.error(`❌ Gagal koneksi: ${err.message}`);
            
            if (i < maxRetries) {
                console.log(`...Menunggu ${delay/1000} detik sebelum mencoba lagi...`);
                // Code pause selama 5 detik
                await new Promise(res => setTimeout(res, delay));
            } else {
                console.error('💀 Gagal total setelah percobaan maksimal. Mematikan server.');
                process.exit(1); // Matikan container agar restart
            }
        }
    }
}

// === MAIN FUNCTION ===
// Server hanya akan jalan JIKA database sudah connect
(async () => {
    // 1. Tunggu DB connect dulu
    await connectWithRetry();

    // 2. Middleware (Contoh)
    app.use(express.json());

    // 3. Contoh Route Sederhana
    app.get('/', (req, res) => {
        res.send('API is running and DB is connected!');
    });

    // 4. Contoh Route ambil data dari DB
    app.get('/users', async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM users'); // Sesuaikan nama tabel
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // 5. Jalankan Server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})();