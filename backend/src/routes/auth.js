const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    return res.json({ id: user.id, email: user.email });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'verysecretkey', { expiresIn: '7d' });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
