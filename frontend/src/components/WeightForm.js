import React, { useState } from 'react';
import API from '../services/api';

export default function WeightForm({ onAdded }) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));

  async function submit(e){
    e.preventDefault();
    try {
      await API.post('/weights', { weight: parseFloat(weight), date });
      setWeight('');
      if (onAdded) onAdded();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding weight');
    }
  }

  return (
    <form onSubmit={submit} style={{ display:'flex', gap:8, alignItems:'center' }}>
      <input required type="number" step="0.1" placeholder="kg" value={weight} onChange={e=>setWeight(e.target.value)} />
      <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
      <button type="submit">Tambah</button>
    </form>
  );
}
