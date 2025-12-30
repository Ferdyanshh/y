import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // --- PALET WARNA TEMA ---
    const colors = {
        bgMain: '#dda3b2',
        bgCard: '#fff0f5',
        primary: '#e85d92',
        textDark: '#6d4555',
        textLight: '#9e7788',
        white: '#ffffff'
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/auth/register', { name, email, password });
            alert('Registrasi Berhasil! Silakan Login.');
            navigate('/login');
        } catch (err) {
            alert('Registrasi Gagal. Coba lagi.');
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: colors.bgMain, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '400px', 
                background: colors.bgCard, 
                padding: '40px', 
                borderRadius: '20px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: `2px solid ${colors.textDark}`,
                margin: '20px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: colors.textDark, margin: '0 0 10px 0' }}>Buat Akun Baru ✨</h1>
                    <p style={{ color: colors.textLight }}>Ayo mulai perjalanan sehatmu!</p>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="Nama Panggilan" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        style={{ 
                            width: '100%', padding: '15px', borderRadius: '12px', border: 'none', 
                            background: colors.white, color: colors.textDark, fontWeight: 'bold', outline: 'none',
                            boxSizing: 'border-box'
                        }} 
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ 
                            width: '100%', padding: '15px', borderRadius: '12px', border: 'none', 
                            background: colors.white, color: colors.textDark, fontWeight: 'bold', outline: 'none',
                            boxSizing: 'border-box'
                        }} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ 
                            width: '100%', padding: '15px', borderRadius: '12px', border: 'none', 
                            background: colors.white, color: colors.textDark, fontWeight: 'bold', outline: 'none',
                            boxSizing: 'border-box'
                        }} 
                    />
                    
                    <button type="submit" style={{ 
                        padding: '15px', background: colors.primary, color: 'white', 
                        border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
                        marginTop: '10px', boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
                    }}>
                        DAFTAR SEKARANG
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', color: colors.textDark }}>
                    Sudah punya akun? <Link to="/login" style={{ color: colors.primary, fontWeight: 'bold', textDecoration: 'none' }}>Login disini</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;