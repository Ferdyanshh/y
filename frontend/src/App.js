import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

// Halaman Dashboard Simpel (Setelah Login)
const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h1>Halo, {user.name || 'User'}!</h1>
      <p>Kamu berhasil login.</p>
      <button onClick={logout} style={{ padding: '10px 20px', background: 'red', color: 'white' }}>Logout</button>
    </div>
  );
};

// Halaman Utama
const Home = () => (
  <div style={{ textAlign: 'center', marginTop: 50 }}>
    <h1>Selamat Datang</h1>
    <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
  </div>
);

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