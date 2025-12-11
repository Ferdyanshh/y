const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes Auth
app.use('/api/auth', require('./src/routes/auth'));

// Cek status
app.get('/', (req, res) => res.send('Server Backend Siap!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server jalan di port ${PORT}`));