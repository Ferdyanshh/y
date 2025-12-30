import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const colors = {
        bgMain: '#dda3b2',
        bgCard: '#fff0f5',
        primary: '#e85d92',
        textDark: '#6d4555',
        textLight: '#9e7788',
        white: '#ffffff'
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            console.log("1. Mengirim data login...", { email, password });
            const res = await axios.post('http://localhost:8000/api/auth/login', { email, password });
            
            console.log("2. Respon Server Login:", res.data); 

            const token = res.data.access_token || res.data.token;

            if (!token) {
                alert("Login Berhasil tapi Token tidak ditemukan! Cek Console.");
                return;
            }

            localStorage.setItem('token', token);
            console.log("3. Token tersimpan:", token);

            try {
                const userRes = await axios.get('http://localhost:8000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const userData = userRes.data;
                console.log("4. Data User:", userData);

                const target = parseFloat(userData.target_weight);

                if (!target || target === 0) {
                    console.log("Target belum ada/0, ke Target Setup");
                    navigate('/target-setup'); 
                } else {
                    console.log(`Target sudah ada (${target} kg), ke Dashboard`);
                    navigate('/dashboard');
                }

            } catch (userErr) {
                console.error("Gagal ambil data user:", userErr);
                if (userErr.response && userErr.response.status === 401) {
                    alert("Sesi tidak valid (401). Cek token backend.");
                } else {
                    navigate('/dashboard');
                }
            }
        
        } catch (err) {
            console.error("Login Error:", err);
            alert('Login Gagal! Cek email/password.');
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
                    <h1 style={{ color: colors.textDark, margin: '0 0 10px 0' }}>Selamat Datang!</h1>
                    <p style={{ color: colors.textLight }}>Silakan masuk untuk melanjutkan dietmu.</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} autoComplete="off">
                    <div>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            name="email_user_app_fix"
                            autoComplete="off"     
                            style={{ 
                                width: '100%', padding: '15px', borderRadius: '12px', border: 'none', 
                                background: colors.white, color: colors.textDark, fontWeight: 'bold', outline: 'none',
                                boxSizing: 'border-box'
                            }} 
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            name="password_user_app_fix"    
                            autoComplete="new-password" 
                            style={{ 
                                width: '100%', padding: '15px', borderRadius: '12px', border: 'none', 
                                background: colors.white, color: colors.textDark, fontWeight: 'bold', outline: 'none',
                                boxSizing: 'border-box'
                            }} 
                        />
                    </div>
                    <button type="submit" style={{ 
                        padding: '15px', background: colors.primary, color: 'white', 
                        border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
                        marginTop: '10px', boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
                    }}>
                        MASUK
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', color: colors.textDark }}>
                    Belum punya akun? <Link to="/register" style={{ color: colors.primary, fontWeight: 'bold', textDecoration: 'none' }}>Daftar disini</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;