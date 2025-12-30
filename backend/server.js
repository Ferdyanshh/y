const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./src/routes/auth');
const weightRoutes = require('./src/routes/weights'); 

app.use('/api/auth', authRoutes);
app.use('/api/weights', weightRoutes); 

app.get('/', (req, res) => {
    res.send('Server Backend Siap! (Port 8000)');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server jalan di port ${PORT}`);
});