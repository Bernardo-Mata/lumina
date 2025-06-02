import React, { useState } from 'react';
import { Activity, Send } from 'lucide-react';

// Recibe data y loading como props
const ChatBot = ({ data, loading }) => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! Ask me anything about your supply chain reports.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    // Simulación de respuesta del bot usando los datos de reportes
    let botResponse = "Sorry, I don't have an answer for that.";
    if (data && typeof data === 'object') {
      if (/risk|trend/i.test(input)) botResponse = data.monthly_risk_trend_analysis || botResponse;
      else if (/performance|supplier/i.test(input)) botResponse = data.supplier_performance_summary || botResponse;
      else if (/compliance|audit/i.test(input)) botResponse = data.compliance_audit_logs || botResponse;
      else if (/export|report/i.test(input)) botResponse = data.custom_exportable_reports || botResponse;
    }
    setMessages([...messages, { from: 'user', text: input }, { from: 'bot', text: botResponse }]);
    setInput('');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Activity className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Reports Chatbot</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="p-4">Loading reports...</div>
        </div>
      </div>
    );
  }

  if (data && data.error) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Activity className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Reports Chatbot</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="p-4 text-red-500">{data.error}</div>
          <pre className="bg-white text-black p-2 rounded mt-2">{data.raw}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-[500px]">
      <div className="flex items-center mb-6">
        <Activity className="text-blue-500 mr-2" size={28} />
        <h2 className="font-bold text-2xl text-gray-800">Reports Chatbot</h2>
      </div>
      <div className="bg-white rounded-lg shadow flex-1 flex flex-col p-4 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs ${
                msg.from === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r flex items-center"
          onClick={handleSend}
        >
          <Send size={18} className="mr-1" /> Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;