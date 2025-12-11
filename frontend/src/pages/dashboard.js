import React, { useEffect, useState } from 'react';
import API from '../services/api';
import WeightForm from '../components/WeightForm';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard(){
  const [logs, setLogs] = useState([]);
  const [profile, setProfile] = useState(null);

  async function load(){
    try {
      const [resLogs, resProfile] = await Promise.all([API.get('/weights'), API.get('/profile')]);
      setLogs(resLogs.data);
      setProfile(resProfile.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{ load(); }, []);

  const data = {
    labels: logs.map(l => l.date),
    datasets: [{ label: 'Weight (kg)', data: logs.map(l => l.weight), fill: false }]
  };

  const current = profile?.current_weight ?? (logs.length ? logs[logs.length-1].weight : null);
  const target = profile?.target_weight ?? null;
  const progressPct = (current && target) ? Math.max(0, Math.min(100, Math.round((1 - ((current - target) / Math.max(current,target))) * 100))) : 0;

  return (
    <div style={{ padding:20 }}>
      <h2>Dashboard</h2>

      <div style={{ display:'flex', gap:20 }}>
        <div style={{ flex:1 }}>
          <h3>Berat Sekarang: {current ?? '-' } kg</h3>
          <h4>Target: {target ?? '-' } kg</h4>
          <div style={{ background:'#eee', height:12, borderRadius:8 }}>
            <div style={{ width: `${progressPct}%`, height: '100%', background:'#00a86b' }} />
          </div>
          <div style={{ marginTop:8 }}>
            <WeightForm onAdded={load} />
          </div>
        </div>

        <div style={{ flex:1 }}>
          <div style={{ maxWidth:500 }}>
            <Line data={data} />
          </div>
        </div>
      </div>

      <div style={{ marginTop:20 }}>
        <h3>Riwayat Berat</h3>
        <table border="1" cellPadding="6">
          <thead><tr><th>Tanggal</th><th>Berat</th><th>Aksi</th></tr></thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td>{l.date}</td>
                <td>{l.weight}</td>
                <td><button onClick={async ()=>{ await API.delete(`/weights/${l.id}`); load(); }}>Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
