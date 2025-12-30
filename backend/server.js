const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Baca konfigurasi .env
dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Supaya bisa baca JSON dari frontend

// --- Import Routes ---
// Import file route auth & weight di sini
const authRoutes = require('./src/routes/auth');
const weightRoutes = require('./src/routes/weights'); 

// --- Gunakan Routes ---
// Daftarkan route SEBELUM server dijalankan (app.listen)
app.use('/api/auth', authRoutes);
app.use('/api/weights', weightRoutes); 

// --- Route Cek Status (Test) ---
app.get('/', (req, res) => {
    res.send('Server Backend Siap! (Port 8000)');
});

// --- Jalankan Server ---
// Bagian ini WAJIB ditaruh paling bawah
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server jalan di port ${PORT}`);
});