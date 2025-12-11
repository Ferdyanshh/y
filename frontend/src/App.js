import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

// Halaman Home
const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>Selamat Datang di Diet App</h1>
    <nav>
      {/* Tombol navigasi */}
      <Link to="/login" style={{ marginRight: '20px', fontSize: '18px' }}>Login</Link>
      <Link to="/register" style={{ fontSize: '18px' }}>Register</Link>
    </nav>
  </div>
);

// Halaman Dashboard (Perlu Logout)
const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const handleLogout = () => {
    localStorage.clear(); // Hapus token
    navigate('/login');   // Lempar balik ke login
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Dashboard Utama</h1>
      <h3>Halo, {user.name || 'User'}!</h3>
      <p>Kamu berhasil masuk ke sistem.</p>
      <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;