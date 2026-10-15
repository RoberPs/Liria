import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Código de acceso solo en memoria (no se guarda en storage ni en el bundle)
  const [accessCode, setAccessCode] = useState('');
  const [invalidCode, setInvalidCode] = useState(false);

  const handleLogin = (code) => {
    setAccessCode(code);
    setInvalidCode(false);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setAccessCode('');
    setIsAuthenticated(false);
  };

  // n8n respondió 401: volver a la pantalla de acceso con aviso
  const handleInvalidCode = () => {
    setAccessCode('');
    setInvalidCode(true);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} invalidCode={invalidCode} />;
  }

  return (
    <div className="app-layout">
      <main className="main-content">
        <ChatInterface
          onLogout={handleLogout}
          accessCode={accessCode}
          onInvalidCode={handleInvalidCode}
        />
      </main>
    </div>
  );
}

export default App;
