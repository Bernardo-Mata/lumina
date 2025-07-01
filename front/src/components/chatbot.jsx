import React, { useState } from 'react';
import { Activity, Send } from 'lucide-react';

// Recibe data y loading como props
const ChatBot = ({ data, loading }) => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! Ask me anything about your supply chain reports.' }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setSending(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch('http://127.0.0.1:8000/chatbot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: input
        })
      });
      const result = await res.json();
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: result.answer || 'Sorry, I do not have an answer for that.' }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: 'Error contacting the chatbot service.' }
      ]);
    }
    setInput('');
    setSending(false);
  };

  if (loading) {
    return (
      <>
        <style>{`
          .lumina-chatbot-loading {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #2563eb;
            font-size: 1.2rem;
          }
          .lumina-chatbot-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #93c5fd;
            border-top: 3px solid #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
        <div className="lumina-chatbot-loading">
          <div className="lumina-chatbot-spinner"></div>
          Cargando chatbot...
        </div>
      </>
    );
  }

  if (data && data.error) {
    return (
      <>
        <style>{`
          .lumina-chatbot-error {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #ef4444;
            font-size: 1.1rem;
            background: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 1rem;
            padding: 2rem;
            margin: 2rem auto;
            max-width: 500px;
          }
          .lumina-chatbot-error-details {
            background: #f3f4f6;
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            white-space: pre-wrap;
            color: #334155;
          }
        `}</style>
        <div className="lumina-chatbot-error">
          <div>{data.error}</div>
          {data.raw && <div className="lumina-chatbot-error-details">{data.raw}</div>}
        </div>
      </>
    );
  }

  return (
    <div className="lumina-bg">
      <div className="lumina-chatbot-container">
        <div className="lumina-chatbot-header">
          <div className="lumina-bot-icon"></div>
          <h2 className="lumina-chatbot-title">Reports ChatBot</h2>
        </div>
        <div className="lumina-chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`lumina-message ${msg.from}`}
            >
              <div
                className={`lumina-message-bubble ${msg.from}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="lumina-message bot">
              <div className="lumina-message-bubble bot">
                <div className="lumina-typing-indicator">
                  <span>AI is thinking</span>
                  <div className="lumina-typing-dots">
                    <div className="lumina-typing-dot"></div>
                    <div className="lumina-typing-dot"></div>
                    <div className="lumina-typing-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="lumina-chat-input-area">
          <input
            className="lumina-chat-input"
            type="text"
            placeholder="Type your question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={sending}
          />
          <button
            className="lumina-send-button"
            onClick={handleSend}
            disabled={sending}
          >
            <Send size={20} className="lumina-send-icon" />
          </button>
        </div>
      </div>
      <style>{`
        .lumina-bg {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0a1929 0%, #1e3a52 50%, #2d5a87 100%);
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lumina-chatbot-container {
          display: flex;
          flex-direction: column;
          width: 90vw;
          max-width: 600px;
          height: 80vh;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          box-sizing: border-box;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.8s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .lumina-chatbot-header {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .lumina-bot-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #40e0ff, #80ffff);
          border-radius: 50%;
          margin-right: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s ease-in-out infinite;
        }
        .lumina-bot-icon::before {
          content: '🤖';
          font-size: 1.2rem;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(64,224,255,0.3);}
          50% { transform: scale(1.1); box-shadow: 0 0 30px rgba(64,224,255,0.6);}
        }
        .lumina-chatbot-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
        }
        .lumina-chat-messages {
          flex: 1 1 0%;
          overflow-y: auto;
          padding: 1rem 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(64,224,255,0.3) transparent;
        }
        .lumina-chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        .lumina-chat-messages::-webkit-scrollbar-thumb {
          background: rgba(64,224,255,0.3);
          border-radius: 3px;
        }
        .lumina-message {
          display: flex;
          margin-bottom: 1rem;
          animation: messageSlide 0.3s ease-out;
        }
        @keyframes messageSlide {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .lumina-message.user { justify-content: flex-end; }
        .lumina-message.bot { justify-content: flex-start; }
        .lumina-message-bubble {
          max-width: 70%;
          padding: 0.75rem 1rem;
          border-radius: 18px;
          word-wrap: break-word;
          position: relative;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .lumina-message-bubble.user {
          background: linear-gradient(135deg, #40e0ff, #80ffff);
          color: #0a1929;
          font-weight: 500;
          margin-left: auto;
          border-bottom-right-radius: 4px;
        }
        .lumina-message-bubble.bot {
          background: rgba(255,255,255,0.15);
          color: #ffffff;
          border-bottom-left-radius: 4px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .lumina-message-bubble.bot::before {
          content: '';
          position: absolute;
          left: -8px;
          bottom: 0;
          width: 0;
          height: 0;
          border-right: 8px solid rgba(255,255,255,0.15);
          border-bottom: 8px solid transparent;
        }
        .lumina-message-bubble.user::after {
          content: '';
          position: absolute;
          right: -8px;
          bottom: 0;
          width: 0;
          height: 0;
          border-left: 8px solid #40e0ff;
          border-bottom: 8px solid transparent;
        }
        .lumina-typing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #80ffff;
          font-style: italic;
          opacity: 0.8;
        }
        .lumina-typing-dots {
          display: flex;
          gap: 0.25rem;
        }
        .lumina-typing-dot {
          width: 6px;
          height: 6px;
          background: #40e0ff;
          border-radius: 50%;
          animation: typingDot 1.4s infinite ease-in-out;
        }
        .lumina-typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .lumina-typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5;}
          40% { transform: scale(1); opacity: 1;}
        }
        .lumina-chat-input-area {
          flex-shrink: 0;
          display: flex;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          background: transparent;
        }
        .lumina-chat-input {
          flex: 1;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 25px;
          padding: 0.75rem 1rem;
          color: #ffffff;
          font-size: 1rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .lumina-chat-input::placeholder {
          color: rgba(255,255,255,0.6);
        }
        .lumina-chat-input:focus {
          outline: none;
          border-color: #40e0ff;
          box-shadow: 0 0 20px rgba(64,224,255,0.3);
          background: rgba(255,255,255,0.15);
        }
        .lumina-send-button {
          background: linear-gradient(135deg, #40e0ff, #80ffff);
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(64,224,255,0.3);
        }
        .lumina-send-button:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(64,224,255,0.5);
        }
        .lumina-send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .lumina-send-icon {
          width: 20px;
          height: 20px;
          fill: #0a1929;
        }
        @media (max-width: 768px) {
          .lumina-chatbot-container {
            padding: 1.5rem;
            border-radius: 15px;
            height: calc(100vh - 200px);
          }
          .lumina-chatbot-title {
            font-size: 1.3rem;
          }
          .lumina-message-bubble {
            max-width: 85%;
          }
        }
        @media (max-width: 480px) {
          .lumina-chatbot-container {
            padding: 1rem;
            height: calc(100vh - 150px);
          }
          .lumina-message-bubble {
            max-width: 90%;
            padding: 0.6rem 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatBot;