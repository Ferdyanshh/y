const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    
    // Cek apakah ada header Authorization
    if (!tokenHeader) {
        return res.status(403).json({ message: 'Akses ditolak! Token tidak tersedia.' });
    }

    // Format token "Bearer <token>"
    const token = tokenHeader.split(' ')[1]; 
    if (!token) {
        return res.status(403).json({ message: 'Format token salah!' });
    }

    // Verifikasi token
    jwt.verify(token, process.env.JWT_SECRET || 'rahasia_negara_api_123', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa!' });
        }
        // Simpan ID user ke request
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;