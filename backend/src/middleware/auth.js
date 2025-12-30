const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];

    if (!tokenHeader) {
        return res.status(403).json({ message: 'Akses ditolak! Token tidak tersedia.' });
    }

    const token = tokenHeader.split(' ')[1]; 
    if (!token) {
        return res.status(403).json({ message: 'Format token salah!' });
    }
    jwt.verify(token, process.env.JWT_SECRET || 'rahasia_negara_api_123', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa!' });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;