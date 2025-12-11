// Filename: server.js

const express = require('express');
const app = express();
const cors = require('cors'); // Opsional, biar aman dari frontend
require('dotenv').config(); // Untuk baca .env

// 1. Panggil file route auth kamu di sini
const authRoutes = require('./routes/auth'); 

// Middleware wajib agar bisa baca JSON dari body request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 2. INI KUNCI UTAMANYA!
// Kode ini bilang: "Kalau ada alamat yg depannya /api/auth,
// tolong oper ke file authRoutes"
app.use('/api/auth', authRoutes);

// Rute test sederhana untuk halaman depan (localhost:5000/)
app.get('/', (req, res) => {
    res.send('Server Backend Jalan! Coba akses /api/auth/login');
});

// Menjalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});