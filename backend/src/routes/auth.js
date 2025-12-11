const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

// --- MIDDLEWARE CEK TOKEN ---
const verifyToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    if (!tokenHeader) return res.status(403).json({ message: 'Token tidak tersedia!' });

    const token = tokenHeader.split(' ')[1]; // Ambil token setelah kata "Bearer"
    if (!token) return res.status(403).json({ message: 'Format token salah!' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token tidak valid!' });
        req.userId = decoded.id;
        next();
    });
};

// --- REGISTER ---
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    User.findByEmail(email, (err, user) => {
        if (user) return res.status(400).json({ message: 'Email sudah terdaftar' });
        
        const hashedPassword = bcrypt.hashSync(password, 8);
        User.create({ name, email, password: hashedPassword }, (err, result) => {
            if (err) return res.status(500).json({ message: 'Gagal register' });
            res.status(201).json({ message: 'Registrasi berhasil' });
        });
    });
});

// --- LOGIN ---
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email, (err, user) => {
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
        
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ message: 'Password salah' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 });
        
        res.status(200).json({ 
            message: 'Login berhasil', 
            accessToken: token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    });
});

// --- GET USER (PROFILE) ---
// Ini route yang Postman kamu cari!
router.get('/me', verifyToken, (req, res) => {
    const db = require('../config/db'); // Pastikan path config DB benar
    const query = "SELECT id, name, email FROM users WHERE id = ?";
    
    db.query(query, [req.userId], (err, results) => {
        if (err) return res.status(500).json({ message: "Error Database" });
        if (results.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });
        res.json(results[0]);
    });
});

module.exports = router;