import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';

const AdminLogin = () => {
  const { login } = useContent();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(password);
    setLoading(false);
    if (!res.ok) setError(res.message || 'No se pudo iniciar sesion');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1512', padding: 20 }}>
      <form
        onSubmit={handleSubmit}
        style={{ width: '100%', maxWidth: 380, background: '#161d19', border: '1px solid rgba(198,183,160,0.2)', borderRadius: 16, padding: 32, color: '#E5DED4', fontFamily: 'Montserrat, sans-serif' }}
      >
        <h1 style={{ fontSize: 22, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Synergy Global</h1>
        <p style={{ fontSize: 13, opacity: 0.7, margin: '6px 0 24px' }}>Panel de administracion</p>

        <label style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Contrasena</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          style={{ width: '100%', boxSizing: 'border-box', margin: '8px 0 16px', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(198,183,160,0.3)', background: '#0f1512', color: '#E5DED4', outline: 'none' }}
        />

        {error && <p style={{ color: '#e88a8a', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#C6B7A0', color: '#1a201c', fontWeight: 600, letterSpacing: '0.05em', cursor: (loading || !password) ? 'default' : 'pointer', opacity: (loading || !password) ? 0.6 : 1 }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
