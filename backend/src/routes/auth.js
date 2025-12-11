const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// --- MIDDLEWARE VERIFIKASI TOKEN ---
// Fungsi ini menjaga route agar hanya bisa diakses user yang sudah login
const verifyToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    
    // Cek apakah ada header Authorization
    if (!tokenHeader) {
        return res.status(403).json({ message: 'Akses ditolak! Token tidak tersedia.' });
    }

    // Format token biasanya "Bearer <token_asli>"
    const token = tokenHeader.split(' ')[1]; 
    if (!token) {
        return res.status(403).json({ message: 'Format token salah!' });
    }

    // Verifikasi token
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa!' });
        }
        // Simpan ID user dari token ke request agar bisa dipakai di route bawahnya
        req.userId = decoded.id;
        next();
    });
};

// --- REGISTER ---
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const [existing] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'Email sudah dipakai!' });

        const hash = bcrypt.hashSync(password, 8);
        await db.promise().query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash]);

        res.status(201).json({ message: 'Registrasi Berhasil!' });
    } catch (err) {
        res.status(500).json({ message: 'Database Error', error: err.message });
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

        const user = users[0];
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Password Salah!' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: 86400 });

        res.json({ message: 'Login Sukses', token, user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Database Error', error: err.message });
    }
});

// --- GET PROFILE (ROUTE ME) ---
// Route ini dilindungi oleh middleware verifyToken
router.get('/users', verifyToken, async (req, res) => {
    try {
        // Query ambil semua user (tanpa WHERE id)
        // Kita tetap sembunyikan password agar aman
        const [users] = await db.promise().query('SELECT id, name, email, created_at FROM users');
        
        res.json(users);
    } catch (err) {
        console.error("Get Users Error:", err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;

module.exports = router;