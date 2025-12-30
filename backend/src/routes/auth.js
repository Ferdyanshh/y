const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// --- MIDDLEWARE VERIFIKASI TOKEN ---
const verifyToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    
    if (!tokenHeader) {
        return res.status(403).json({ message: 'Akses ditolak! Token tidak tersedia.' });
    }

    const token = tokenHeader.split(' ')[1]; 
    if (!token) {
        return res.status(403).json({ message: 'Format token salah!' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa!' });
        }
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

        // Kirim token dan data user (termasuk target_weight kalau ada)
        res.json({ 
            message: 'Login Sukses', 
            token, // Backend kirim key "token"
            access_token: token, // Opsional: kirim "access_token" juga biar frontend Login.js kamu lgsg jalan
            user: { 
                name: user.name, 
                email: user.email,
                target_weight: user.target_weight 
            } 
        });
    } catch (err) {
        res.status(500).json({ message: 'Database Error', error: err.message });
    }
});

// --- GET PROFILE (ROUTE ME) ---
router.get('/me', verifyToken, async (req, res) => {
    try {
        const [users] = await db.promise().query(
            'SELECT id, name, email, target_weight FROM users WHERE id = ?', 
            [req.userId]
        );
        
        if (users.length === 0) return res.status(404).json({ message: 'User ga ketemu' });
        
        res.json(users[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// --- UPDATE TARGET WEIGHT (INI YANG BARU) ---
router.put('/update', verifyToken, async (req, res) => {
    const { target_weight } = req.body;

    if (!target_weight) {
        return res.status(400).json({ message: 'Target weight wajib diisi!' });
    }

    try {
        const [result] = await db.promise().query(
            'UPDATE users SET target_weight = ? WHERE id = ?',
            [target_weight, req.userId]
        );

        res.json({ message: 'Target berhasil disimpan!', target_weight });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// --- GET ALL USERS ---
router.get('/users', verifyToken, async (req, res) => {
    try {
        const [users] = await db.promise().query('SELECT id, name, email, created_at FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;