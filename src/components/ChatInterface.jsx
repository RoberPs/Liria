import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendMessageToWebhook } from '../services/api';

// Icono del mazo o robot "Lindo" para que destaque arriba
// Icono del mazo o robot "Lindo" para que destaque arriba
const botAvatarUrl = "/user_avatar.jpg"; // Avatar local desde public/user_avatar.jpg
const humanAvatarUrl = "/human_avatar.jpg"; // Avatar del usuario

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola Silvia! Soy Liria. Estoy lista para ayudarte con cualquier consulta sobre el BOE.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const conversationId = useRef(`session_${Date.now()}`);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleClearChat = () => {
    if (window.confirm("¿Reiniciar conversación?")) {
      setMessages([{ id: 1, text: "¡Hola Silvia! Soy Liria. Estoy lista para ayudarte con cualquier consulta sobre el BOE.", sender: 'bot', timestamp: new Date() }]);
      conversationId.current = `session_${Date.now()}`;
    }
  };

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Stop after one sentence
      recognitionRef.current.lang = 'es-ES';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  }, []);

  const handleMicClick = (e) => {
    e.preventDefault();
    if (!recognitionRef.current) {
      alert("El reconocimiento de voz no es soportado en este navegador.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const formatBotResponse = (text) => {
    if (!text) return "";
    // Bold dates like "17 de diciembre de 2025"
    let formatted = text.replace(/(\d{1,2} de [a-zA-Z]+ de \d{4})/g, '**$1**');
    // Bold "BOE" and "BOE oficial completo"
    formatted = formatted.replace(/(^|[^=/])(BOE(?: oficial completo)?)/g, '$1**$2**');
    return formatted;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare history for context if needed (optional)
      const history = messages.map(m => ({ role: m.sender, content: m.text }));
      
      const response = await sendMessageToWebhook(newUserMessage.text, history, conversationId.current);
      
      // Check for 'respuesta' as configured in n8n, fallback to other common keys
      let botText = response.respuesta || response.output || response.text || response.message || "Respuesta recibida del webhook.";
      botText = formatBotResponse(botText);
      
      // FIX: Capturar enlace del BOE si viene en la respuesta
      const botLink = response.link || response.url || response.boe_url || response.source;

      const newBotMessage = {
        id: Date.now() + 1,
        text: botText,
        boeLink: botLink, // Add link to state
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const boeUrl = `https://www.boe.es/boe/dias/${year}/${month}/${day}/index.php?s=1`;

      const errorMessage = {
        id: Date.now() + 1,
        text: formatBotResponse('Lo siento, ha surgido un problema técnico al consultar la base de datos legal. Por favor, inténtalo de nuevo en unos segundos.'),
        boeLink: boeUrl,
        sender: 'bot',
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="chat-container">
      {/* --- CABECERA ESTILO HIBOT --- */}
      <div className="chat-header">
        {/* Avatar Flotante Central */}
        <div className="floating-avatar-container">
          <img src={botAvatarUrl} alt="Asistente" />
        </div>
        
        {/* Títulos */}
        <h1 className="brand-title" style={{ fontFamily: '"Playfair Display", serif' }}>Liria</h1>
        <p className="brand-subtitle">Jurista Especializada en Penal</p>
        
        {/* Botón borrar discreto */}
        <div className="header-actions">
          <button onClick={handleClearChat} className="clear-btn" title="Limpiar chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* --- ZONA DE MENSAJES --- */}
      <div className="messages-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
            {msg.sender === 'bot' && <span className="sender-name">Asistente</span>}
            
            {msg.sender === 'bot' ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ 
                  width: '35px', 
                  height: '35px', 
                  minWidth: '35px', 
                  minHeight: '35px',
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  flexShrink: 0 
                }}>
                  <img 
                    src={botAvatarUrl} 
                    alt="Asistente" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className={`message-bubble ${msg.sender} ${msg.isError ? 'error' : ''}`}>
                  <div className="markdown-content">
                    <ReactMarkdown 
                      components={{
                        a: ({ node, ...props }) => (
                          <a {...props} target="_blank" rel="noopener noreferrer" />
                        )
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                    {/* --- FIX: Mostrar enlace si existe --- */}
                    {msg.boeLink && (
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                        <a 
                          href={msg.boeLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#2563eb', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <span>📄</span> Ver en el BOE Oficial
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                <div className={`message-bubble ${msg.sender} ${msg.isError ? 'error' : ''}`}>
                  <p>{msg.text}</p>
                </div>
                <div style={{ 
                  width: '35px', 
                  height: '35px', 
                  minWidth: '35px', 
                  minHeight: '35px',
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  flexShrink: 0 
                }}>
                  <img 
                    src={humanAvatarUrl} 
                    alt="Usuario" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="message-wrapper bot">
            <span className="sender-name">Asistente</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ 
                width: '35px', 
                height: '35px', 
                minWidth: '35px', 
                minHeight: '35px',
                borderRadius: '50%', 
                overflow: 'hidden', 
                flexShrink: 0 
              }}>
                <img 
                  src={botAvatarUrl} 
                  alt="Asistente" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="message-bubble bot">
                <div className="typing-indicator">
                  <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT FLOTANTE --- */}
      <form className="input-area" onSubmit={handleSendMessage}>
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu consulta..."
            disabled={isLoading}
          />
          <button 
            type="button" 
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={handleMicClick}
            title={isListening ? "Detener escucha" : "Usar voz"}
            style={{ 
              marginRight: '8px', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: isListening ? '#ef4444' : '#666',
              transition: 'color 0.2s',
              animation: isListening ? 'pulse 1.5s infinite' : 'none'
            }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              {isListening ? (
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              ) : (
                <>
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </>
              )}
            </svg>
            <style>{`
              @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
              }
            `}</style>
          </button>
          <button type="submit" className="send-btn" disabled={isLoading || !inputValue.trim()}>
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;