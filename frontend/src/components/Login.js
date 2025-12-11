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
      // Pastikan URL ini sesuai dengan route di backend kamu
      // Biasanya: http://localhost:5000/api/auth/login atau semacamnya
      const response = await axios.post('http://localhost:5000/login', {
        email: email,
        password: password
      });

      console.log('Login Berhasil:', response.data);
      alert('Login Berhasil!');
      
      // Simpan token jika ada (opsional, nanti kita bahas)
      // localStorage.setItem('token', response.data.token);
      
      // Pindah ke halaman dashboard/home
      navigate('/dashboard'); 

    } catch (error) {
      console.error('Error:', error);
      alert('Login Gagal: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Halaman Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email: </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Password: </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" style={{ marginTop: '20px' }}>Login</button>
      </form>
    </div>
  );
};

export default Login;