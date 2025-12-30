const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- PERBAIKAN PENTING ---
// Kita panggil file 'auth' karena file kamu namanya backend/src/middleware/auth.js
const verifyToken = require('../middleware/auth'); 

// 1. GET: Ambil Data Grafik
router.get('/', verifyToken, async (req, res) => {
    try {
        const [logs] = await db.promise().query(
            'SELECT * FROM weight_logs WHERE user_id = ? ORDER BY date ASC', 
            [req.userId]
        );
        res.json(logs);
    } catch (err) {
        console.error("Error GET Weights:", err);
        res.status(500).json({ message: 'Gagal ambil data', error: err.message });
    }
});

// 2. POST: Input Berat Harian
router.post('/', verifyToken, async (req, res) => {
    const { weight, date, notes } = req.body;
    try {
        await db.promise().query(
            'INSERT INTO weight_logs (user_id, weight, date, notes) VALUES (?, ?, ?, ?)',
            [req.userId, weight, date, notes]
        );
        res.status(201).json({ message: 'Berat badan tersimpan!' });
    } catch (err) {
        console.error("Error POST Weight:", err);
        res.status(500).json({ message: 'Gagal simpan', error: err.message });
    }
});

// 3. PUT: Update Target Berat Badan
router.put('/target', verifyToken, async (req, res) => {
    const { targetWeight } = req.body;
    
    // Validasi input
    if (!targetWeight) {
        return res.status(400).json({ message: 'Target berat harus diisi!' });
    }

    try {
        console.log(`Updating target for user ${req.userId} to ${targetWeight}`); // Cek log terminal
        
        await db.promise().query(
            'UPDATE users SET target_weight = ? WHERE id = ?',
            [targetWeight, req.userId]
        );
        
        res.json({ message: 'Target berhasil diupdate!' });
    } catch (err) {
        console.error("Error PUT Target:", err);
        res.status(500).json({ message: 'Gagal update target', error: err.message });
    }
});

module.exports = router;