const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Pastikan pakai bcryptjs sesuai package.json
const jwt = require('jsonwebtoken');
const User = require('../model/user'); // INI SUDAH DIPERBAIKI (model/user)

// REGISTER
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    User.findByEmail(email, (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (user) return res.status(400).json({ message: 'Email sudah terdaftar' });

        const hashedPassword = bcrypt.hashSync(password, 8);

        User.create({ name, email, password: hashedPassword }, (err, result) => {
            if (err) return res.status(500).json({ message: 'Gagal mendaftarkan user' });
            res.status(201).json({ message: 'Registrasi berhasil' });
        });
    });
});

// LOGIN
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Password salah' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 jam
        });

        res.status(200).json({
            message: 'Login berhasil',
            accessToken: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    });
});

module.exports = router;