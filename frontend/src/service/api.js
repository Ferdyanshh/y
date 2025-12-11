import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';

// Komponen Home Sederhana
const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>Selamat Datang di Diet App</h1>
    <nav>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </nav>
  </div>
);

// Komponen Dashboard Sederhana (Hanya bisa diakses setelah login - simulasi)
const Dashboard = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>Ini Dashboard</h1>
    <p>Anda berhasil masuk!</p>
    <Link to="/">Logout</Link>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Nanti tambahkan Route Register di sini */}
      </Routes>
    </Router>
  );
}

export default App;