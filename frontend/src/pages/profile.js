import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Profile(){
  const [profile, setProfile] = useState({});
  useEffect(()=>{ API.get('/profile').then(r=>setProfile(r.data)); }, []);

  function change(e){ setProfile({...profile, [e.target.name]: e.target.value}); }

  async function save(e){
    e.preventDefault();
    await API.put('/profile', { current_weight: profile.current_weight, target_weight: profile.target_weight });
    alert('Saved');
  }

  return (
    <form onSubmit={save} style={{ padding:20 }}>
      <h2>Profile</h2>
      <label>Current weight</label><br/>
      <input name="current_weight" value={profile.current_weight||''} onChange={change} /><br/>
      <label>Target weight</label><br/>
      <input name="target_weight" value={profile.target_weight||''} onChange={change} /><br/>
      <button>Save</button>
    </form>
  );
}
