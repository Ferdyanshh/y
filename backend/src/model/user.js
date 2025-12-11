const db = require('../config/db');

const User = {
    // Cari user berdasarkan email
    findByEmail: (email, callback) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results[0]);
        });
    },

    // Buat user baru
    create: (data, callback) => {
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(query, [data.name, data.email, data.password], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }
};

module.exports = User;