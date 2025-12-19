import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'Liria2025Pastor') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="login-container" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
    }}>
      <div className="login-card" style={{
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '3rem',
        borderRadius: '24px',
        boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.1), 0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(20px)',
        textAlign: 'center',
        width: '90%',
        maxWidth: '400px',
        border: '1px solid rgba(255, 255, 255, 0.8)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          overflow: 'hidden',
          margin: '0 auto 1.5rem',
          border: '4px solid white',
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)'
        }}>
          <img src="/user_avatar.jpg" alt="Liria" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <h1 style={{ 
          fontFamily: '"Playfair Display", serif', 
          fontSize: '2rem', 
          color: '#1e3a8a',
          marginBottom: '0.5rem'
        }}>
          Liria
        </h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Acceso restringido</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: `2px solid ${error ? '#ef4444' : '#e2e8f0'}`,
              marginBottom: '1rem',
              outline: 'none',
              fontSize: '1rem',
              transition: 'border-color 0.2s',
              background: '#f8fafc'
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: '#2563eb',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.background = '#2563eb'}
          >
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
