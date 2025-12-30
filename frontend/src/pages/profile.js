import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [targetWeight, setTargetWeight] = useState('');
    const [password, setPassword] = useState('');

    const colors = {
        bgMain: '#dda3b2',
        bgCard: '#fff0f5',
        primary: '#e85d92',
        textDark: '#6d4555',
        textLight: '#9e7788',
        white: '#ffffff',
        danger: '#dc2626'
    };

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }

            try {
                const res = await axios.get('http://localhost:8000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const user = res.data;
                setName(user.name);
                setEmail(user.email);
                setTargetWeight(user.target_weight || '');
            } catch (err) {
                alert("Gagal mengambil data profil.");
            }
        };
        fetchUser();
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            const payload = {
                name,
                email,
                target_weight: targetWeight
            };
            if (password) payload.password = password;

            await axios.put('http://localhost:8000/api/auth/update-profile', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Profil berhasil diperbarui!");
            setPassword('');
        } catch (err) {
            console.error(err);
            alert("Gagal update profil: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async () => {
        if (window.confirm("⚠️ YAKIN MAU HAPUS AKUN?\nData yang dihapus tidak bisa kembali lagi!")) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete('http://localhost:8000/api/auth/delete-account', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                alert("Akun berhasil dihapus. Sampai jumpa! 👋");
                localStorage.removeItem('token');
                navigate('/login');
            } catch (err) {
                alert("Gagal menghapus akun: " + (err.response?.data?.message || err.message));
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
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '500px', 
                background: colors.bgCard, 
                padding: '40px', 
                borderRadius: '20px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: `2px solid ${colors.textDark}`
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: colors.textDark, margin: '0' }}>⚙️ Edit Profil</h1>
                    <p style={{ color: colors.textLight }}>Atur informasi akunmu disini.</p>
                </div>

                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    <div>
                        <label style={{ color: colors.textDark, fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nama Lengkap</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle(colors)} />
                    </div>

                    <div>
                        <label style={{ color: colors.textDark, fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle(colors)} />
                    </div>

                    <div>
                        <label style={{ color: colors.textDark, fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Target Berat (kg)</label>
                        <input type="number" step="0.1" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} style={inputStyle(colors)} />
                    </div>

                    <div>
                        <label style={{ color: colors.textDark, fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Password Baru (Opsional)</label>
                        <input type="password" placeholder="Isi hanya jika ingin ganti password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle(colors)} />
                    </div>

                    <button type="submit" style={{ 
                        padding: '15px', background: colors.primary, color: 'white', 
                        border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
                        marginTop: '10px', boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
                    }}>
                        💾 SIMPAN PERUBAHAN
                    </button>
                </form>

                <hr style={{ border: `1px dashed ${colors.textLight}`, margin: '30px 0' }} />

                <div style={{ textAlign: 'center' }}>
                    <h4 style={{ color: colors.danger, marginTop: 0 }}>Zona Bahaya</h4>
                    <button onClick={handleDelete} style={{ 
                        padding: '10px 20px', background: 'transparent', color: colors.danger, 
                        border: `2px solid ${colors.danger}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                    }}>
                        🗑️ Hapus Akun Saya
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/dashboard" style={{ color: colors.textDark, textDecoration: 'none', fontWeight: 'bold' }}>
                        ← Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

const inputStyle = (colors) => ({
    width: '100%', padding: '12px', borderRadius: '10px', border: 'none', 
    background: colors.white, color: colors.textDark, fontWeight: 'bold', outline: 'none',
    boxSizing: 'border-box'
});

export default Profile;