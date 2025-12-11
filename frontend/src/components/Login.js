import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Pastikan URL mengarah ke port 5000 backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email,
        password: password
      });

      console.log('Login Berhasil:', response.data);
      
      // Simpan data user/token di localStorage agar sesi bertahan
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
      }

      alert('Login Berhasil!');
      navigate('/dashboard'); 

    } catch (error) {
      console.error('Error Details:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login Gagal';
      alert('Login Gagal: ' + errorMessage);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Halaman Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email: </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Password: </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px' }}>Login</button>
      </form>
    </div>
  );
};

export default Login;