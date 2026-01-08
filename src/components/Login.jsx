import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_APP_PASSWORD) {
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

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              style={{
                width: '100%',
                padding: '12px 16px',
                paddingRight: '45px', // Space for the eye icon
                borderRadius: '12px',
                border: `2px solid ${error ? '#ef4444' : '#e2e8f0'}`,
                outline: 'none',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                background: '#f8fafc'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
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
