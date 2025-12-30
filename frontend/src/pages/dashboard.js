import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

const Dashboard = () => {
    // State user & data
    const [user, setUser] = useState({ name: 'Teman', target_weight: null });
    const [weights, setWeights] = useState([]);
    
    // State Input Harian
    const [weightInput, setWeightInput] = useState('');
    const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
    
    // State Waktu Makan
    const [mealTime, setMealTime] = useState('Pagi');

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // --- PALET WARNA (Tetap sesuai request) ---
    const colors = {
        bgMain: '#dda3b2',      // Dusty Pink Background
        bgCard: '#fff0f5',      // Card Putih kemerahan
        primary: '#e85d92',     // Pink Tua (Chart Line & Button)
        textDark: '#6d4555',    // Text Utama
        textLight: '#9e7788',   // Text Sekunder
        gold: '#facc15',        // Target / Highlight
        white: '#ffffff'
    };

    // --- 1. CEK WAKTU ---
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 11) setMealTime('Pagi');
        else if (hour >= 11 && hour < 15) setMealTime('Siang');
        else if (hour >= 15 && hour < 19) setMealTime('Sore');
        else setMealTime('Malam');
    }, []);

    // --- DATA REKOMENDASI ---
    const recommendations = {
        'Pagi': { title: '🌞 Sarapan Berenergi', items: [{ icon: '🍞', type: 'Karbo', name: 'Roti Gandum' }, { icon: '🥚', type: 'Lauk', name: 'Telur Rebus' }, { icon: '🥗', type: 'Sayur', name: 'Salad' }, { icon: '🍌', type: 'Buah', name: 'Pisang' }] },
        'Siang': { title: '☀️ Makan Siang Sehat', items: [{ icon: '🍚', type: 'Karbo', name: 'Nasi Merah' }, { icon: '🍗', type: 'Lauk', name: 'Ayam Bakar' }, { icon: '🥦', type: 'Sayur', name: 'Capcay' }, { icon: '🍊', type: 'Buah', name: 'Jeruk' }] },
        'Sore': { title: '⛅ Snack Sore', items: [{ icon: '🍠', type: 'Karbo', name: 'Ubi Rebus' }, { icon: '🥣', type: 'Protein', name: 'Yoghurt' }, { icon: '🥕', type: 'Serat', name: 'Wortel' }, { icon: '🍵', type: 'Minum', name: 'Teh Hijau' }] },
        'Malam': { title: '🌙 Makan Malam Ringan', items: [{ icon: '🌽', type: 'Karbo', name: 'Jagung' }, { icon: '🐟', type: 'Lauk', name: 'Ikan Tim' }, { icon: '🥬', type: 'Sayur', name: 'Sup Bayam' }, { icon: '💧', type: 'Minum', name: 'Air Hangat' }] }
    };

    // --- 2. FETCH DATA ---
    const fetchData = useCallback(async () => {
        try {
            if (!token) { navigate('/login'); return; }
            const userRes = await axios.get('http://localhost:8000/api/auth/me', config);
            const weightRes = await axios.get('http://localhost:8000/api/weights', config);
            
            const userData = userRes.data;
            if (userData.target_weight) userData.target_weight = parseFloat(userData.target_weight);
            setUser(userData);
            
            const formattedData = weightRes.data.map(item => ({
                ...item, date: item.date ? item.date.substring(0, 10) : '', weight: parseFloat(item.weight)
            }));
            setWeights(formattedData);
        } catch (err) {
            if (err.response && err.response.status === 401) navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleAddWeight = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/weights', { weight: weightInput, date: dateInput }, config);
            setWeightInput(''); fetchData(); 
        } catch (err) { alert('Gagal menyimpan berat badan'); }
    };

    const renderMotivationMessage = () => {
        if (!user.target_weight || weights.length === 0) return null;
        const currentWeight = weights[weights.length - 1].weight;
        const target = user.target_weight;
        const diff = Math.abs(currentWeight - target);
        const style = { padding: '15px', borderRadius: '15px', marginBottom: '20px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: `2px solid ${colors.textDark}` };

        if (diff === 0) return <div style={{...style, background: colors.gold, color: colors.textDark}}><h3>🎉 CIEEE SELAMAT, TARGETMU SUDAH TERCAPAII!!! 👑</h3><p>Beratmu pas di {target} kg.</p></div>;
        if (diff <= 2) return <div style={{...style, background: colors.primary, color: 'white'}}><h3>🔥 KAMU HEBAT!</h3><p>Tinggal {diff.toFixed(1)} kg lSgi!</p></div>;
        return <div style={{...style, background: colors.bgCard, color: colors.textDark}}><h3>💪 Ayooo kamu pasti bisa!</h3><p>Sisa {diff.toFixed(1)} kg menuju target.</p></div>;
    };

    return (
        <div style={{ minHeight: '100vh', background: colors.bgMain, fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: colors.textDark, fontWeight: 'bold', fontSize: '28px' }}>Halo, {user.name}! 👋</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link to="/target-setup" style={{ padding: '8px 15px', background: colors.gold, color: colors.textDark, textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', border: `2px solid ${colors.textDark}` }}>Target</Link>
                        <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ padding: '8px 15px', background: colors.textDark, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
                    </div>
                </div>

                {/* Pesan Motivasi */}
                {renderMotivationMessage()}

                {/* Rekomendasi Menu */}
                <div style={{ marginBottom: '30px', background: colors.bgCard, padding: '25px', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: colors.primary, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: colors.primary, color: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '14px' }}>MENU</span> {recommendations[mealTime].title}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px' }}>
                        {recommendations[mealTime].items.map((item, index) => (
                            <div key={index} style={{ background: 'white', padding: '15px', borderRadius: '15px', textAlign: 'center', border: `1px solid ${colors.bgMain}`, boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '28px', marginBottom: '5px' }}>{item.icon}</div>
                                <div style={{ fontSize: '12px', color: colors.textLight, fontWeight: 'bold', textTransform: 'uppercase' }}>{item.type}</div>
                                <div style={{ fontSize: '15px', color: colors.textDark, fontWeight: '600' }}>{item.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GRAFIK (Fixed Margin) */}
                <div style={{ marginBottom: '30px', background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ textAlign: 'center', marginTop: 0, color: colors.textDark }}>📉 Grafik Perkembangan Kamu!</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            {/* DISINI PERUBAHAN MARGINNYA: right: 60 */}
                            <LineChart data={weights} margin={{ top: 5, right: 60, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis dataKey="date" tick={{ fill: colors.textLight }} />
                                <YAxis domain={['auto', 'auto']} tick={{ fill: colors.textLight }} />
                                <Tooltip contentStyle={{ borderRadius: '10px', borderColor: colors.primary }} />
                                <Line type="monotone" dataKey="weight" stroke={colors.primary} strokeWidth={4} dot={{ r: 6, fill: colors.primary }} activeDot={{ r: 8, stroke: colors.gold, strokeWidth: 2 }} />
                                {user.target_weight && (
                                    <ReferenceLine 
                                        y={user.target_weight} 
                                        stroke={colors.gold} 
                                        strokeDasharray="5 5" 
                                        strokeWidth={3}
                                        // Label aman karena margin chart sudah dilebarkan
                                        label={{ position: 'right', value: 'Target', fill: colors.gold, fontSize: 12, fontWeight: 'bold' }} 
                                    />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Form Input */}
                <div style={{ background: colors.bgCard, padding: '25px', borderRadius: '20px', border: `1px solid ${colors.bgMain}` }}>
                    <h3 style={{ margin: '0 0 15px 0', color: colors.textDark }}>✏️ Catat Berat Hari Ini</h3>
                    <form onSubmit={handleAddWeight} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} required style={{ padding: '15px', borderRadius: '12px', border: 'none', background: 'white', color: colors.textDark, fontWeight: 'bold', outline: 'none', flex: '1' }} />
                        <input type="number" placeholder="Berat (kg)" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} required style={{ flex: '2', padding: '15px', borderRadius: '12px', border: 'none', background: 'white', color: colors.textDark, fontWeight: 'bold', outline: 'none' }} />
                        <button type="submit" style={{ padding: '15px 30px', background: colors.primary, color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>SIMPAN</button>
                    </form>
                </div>
                
            </div>
        </div>
    );
};

export default Dashboard;