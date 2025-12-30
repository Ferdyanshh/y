import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const TargetSetup = () => {
    const [target, setTarget] = useState('');
    const navigate = useNavigate();

    // --- PALET WARNA ---
    const colors = {
        bgMain: '#dda3b2',
        bgCard: '#fff0f5',
        primary: '#e85d92',
        textDark: '#6d4555',
        textLight: '#9e7788',
        gold: '#facc15',
        white: '#ffffff'
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        // 1. Ambil token terbaru
        const token = localStorage.getItem('token');
        console.log("1. Token saat ini:", token);

        if (!token) {
            alert("Error: Kamu belum login (Token kosong). Silakan login ulang.");
            navigate('/login');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // 2. Pastikan data dikirim sebagai ANGKA (Float/Number), bukan String
            const payload = { target_weight: parseFloat(target) };
            
            console.log("2. Mengirim data ke server:", payload);

            // --- PERHATIKAN ENDPOINT INI ---
            // Asumsi endpoint update profil adalah '/api/auth/update'
            // Kalau backend kamu pakai endpoint lain (misal '/api/user'), ganti di sini!
            const res = await axios.put('http://localhost:8000/api/auth/update', payload, config);

            console.log("3. Berhasil simpan!", res.data);
            navigate('/dashboard');

        } catch (err) {
            console.error("ERROR SAVE TARGET:", err);

            // --- DEBUGGING ERROR ---
            if (err.response) {
                // Error dari Backend (4xx atau 5xx)
                const status = err.response.status;
                const msg = err.response.data.message || JSON.stringify(err.response.data);
                
                console.log(`Status: ${status}`);
                console.log(`Pesan: ${msg}`);

                if (status === 401) {
                    alert("Sesi habis (401). Silakan Logout dan Login lagi.");
                } else if (status === 404) {
                    alert("Endpoint Tidak Ditemukan (404). Cek URL API di kodingan.");
                } else {
                    alert(`Gagal Simpan (${status}): ${msg}`);
                }
            } else if (err.request) {
                // Tidak ada respon dari server
                alert("Server tidak merespon. Cek apakah backend jalan?");
            } else {
                alert("Error Aplikasi: " + err.message);
            }
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
                margin: '20px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>
                   👑
                </div>
                
                <h2 style={{ color: colors.textDark, margin: '0 0 10px 0' }}>Atur Target Impianmu</h2>
                <p style={{ color: colors.textLight, marginBottom: '30px' }}>
                    Mau berat badan berapa? Tulis targetmu di bawah ini biar makin semangat!
                </p>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="number" 
                            placeholder="0" 
                            value={target} 
                            onChange={(e) => setTarget(e.target.value)} 
                            required 
                            step="0.1"
                            style={{ 
                                width: '100%', padding: '20px', borderRadius: '15px', border: 'none', 
                                background: colors.white, color: colors.textDark, fontWeight: 'bold', outline: 'none',
                                boxSizing: 'border-box', fontSize: '24px', textAlign: 'center'
                            }} 
                        />
                        <span style={{ 
                            position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', 
                            color: colors.textLight, fontWeight: 'bold' 
                        }}>KG</span>
                    </div>
                    
                    <button type="submit" style={{ 
                        padding: '15px', background: colors.gold, color: colors.textDark, 
                        border: `2px solid ${colors.textDark}`, borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
                        marginTop: '10px', boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
                    }}>
                        SIMPAN TARGET
                    </button>

                    <Link to="/dashboard" style={{ 
                        marginTop: '10px', color: colors.textLight, textDecoration: 'none', fontSize: '14px' 
                    }}>
                        Kembali ke Dashboard
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default TargetSetup;