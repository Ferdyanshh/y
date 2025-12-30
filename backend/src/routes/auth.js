const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../config/db');

const verifyToken = require('../middleware/auth');

dotenv.config();

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

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

        const user = users[0];
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Password Salah!' });
        }

        const secretKey = process.env.JWT_SECRET || 'rahasia_negara_api_123';
        
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: 86400 });

        res.json({ 
            message: 'Login Sukses', 
            token, 
            access_token: token, 
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

router.put('/update-profile', verifyToken, async (req, res) => {
    const { name, email, password, target_weight } = req.body;
    const userId = req.userId;

    try {
        let fields = [];
        let values = [];

        if (name) { fields.push('name = ?'); values.push(name); }
        if (email) { fields.push('email = ?'); values.push(email); }
        if (target_weight) { fields.push('target_weight = ?'); values.push(target_weight); }
        if (password) {
            const hash = bcrypt.hashSync(password, 8);
            fields.push('password = ?');
            values.push(hash);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'Tidak ada data yang diubah.' });
        }

        values.push(userId);
        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

        await db.promise().query(sql, values);

        res.json({ message: 'Profil berhasil diperbarui!' });
    } catch (err) {
        console.error("Update Profile Error:", err);
        res.status(500).json({ message: 'Gagal update profil', error: err.message });
    }
});

router.delete('/delete-account', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const [result] = await db.promise().query('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        res.json({ message: 'Akun berhasil dihapus permanent. Sampai jumpa!' });
    } catch (err) {
        console.error("Delete Account Error:", err);
        res.status(500).json({ message: 'Gagal menghapus akun', error: err.message });
    }
});

router.get('/users', verifyToken, async (req, res) => {
    try {
        const [users] = await db.promise().query('SELECT id, name, email, created_at FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;