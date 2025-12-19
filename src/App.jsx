import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-layout">
      <main className="main-content">
        <ChatInterface onLogout={() => setIsAuthenticated(false)} />
      </main>
    </div>
  );
}

export default App;
