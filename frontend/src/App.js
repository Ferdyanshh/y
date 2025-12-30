import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TargetSetup from './pages/TargetSetup';
import Dashboard from './pages/dashboard';

import Profile from './pages/profile'; 

const Home = () => {
  const token = localStorage.getItem('token');
  if (token) return <Navigate to="/dashboard" />;

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
      <h1>🥗 Diet App</h1>
      <p>Aplikasi pencatat berat badan simpel & mudah.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/login" style={{ marginRight: '15px', fontSize: '18px' }}>Login</Link>
        <Link to="/register" style={{ fontSize: '18px' }}>Register</Link>
      </div>
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
        <Route path="/target-setup" element={<TargetSetup />} />

        <Route path="/profile" element={<Profile />} />
        
      </Routes>
    </Router>
  );
}

export default App;