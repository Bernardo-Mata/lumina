import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const Disruption = () => {
  const [disruptions, setDisruptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisruptions = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user_disruption", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (res.ok) {
          const data = await res.json();
          setDisruptions(Array.isArray(data) ? data : []);
        } else {
          setDisruptions([]);
        }
      } catch (err) {
        setDisruptions([]);
      }
      setLoading(false);
    };
    fetchDisruptions();
  }, []);

  return (
    <>
      <div className="floating-elements">
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-triangle"></div>
        <div className="floating-triangle"></div>
      </div>
      <div className="container">
        <div className="header">
          <div className="logo">
            <AlertTriangle size={24} />
          </div>
          <h1 className="title">Disruption</h1>
        </div>
        <div className="glass-card">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              Loading disruption information...
            </div>
          ) : disruptions.length === 0 ? (
            <div className="no-data">
              <AlertTriangle className="no-data-icon" size={64} />
              <div>No disruption information available.</div>
            </div>
          ) : (
            <ul className="disruption-list">
              {disruptions.map((d, idx) => {
                // Opcional: puedes usar d.severity si existe, si no, default
                let severity = '';
                if (d.severity === 'high') severity = 'severity-high warning-glow';
                else if (d.severity === 'medium') severity = 'severity-medium';
                else if (d.severity === 'low') severity = 'severity-low';
                return (
                  <li className={`disruption-item ${severity}`} key={idx}>
                    <div className="disruption-title">
                      <AlertTriangle size={20} />
                      {d.summary || "Disruption detected"}
                    </div>
                    {d.causes && (
                      <div className="disruption-detail">
                        <span className="disruption-label">Causes:</span> {d.causes}
                      </div>
                    )}
                    {d.affected_suppliers && (
                      <div className="disruption-detail">
                        <span className="disruption-label">Affected Suppliers:</span> {d.affected_suppliers}
                      </div>
                    )}
                    {d.recommendations && (
                      <div className="disruption-detail">
                        <span className="disruption-label">Recommendations:</span> {d.recommendations}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0a1929 0%, #1e3a52 50%, #2d5a87 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        .floating-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }
        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(255, 193, 7, 0.1), rgba(255, 235, 59, 0.05));
          animation: float 6s ease-in-out infinite;
        }
        .floating-triangle {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 30px solid transparent;
          border-right: 30px solid transparent;
          border-bottom: 52px solid rgba(255, 193, 7, 0.08);
          animation: rotate 8s linear infinite;
        }
        .floating-circle:nth-child(1) {
          width: 180px;
          height: 180px;
          top: 15%;
          left: 75%;
          animation-delay: -2s;
        }
        .floating-circle:nth-child(2) {
          width: 120px;
          height: 120px;
          top: 65%;
          left: 15%;
          animation-delay: -4s;
        }
        .floating-triangle:nth-child(3) {
          top: 40%;
          left: 5%;
          animation-delay: -1s;
        }
        .floating-triangle:nth-child(4) {
          top: 20%;
          left: 90%;
          animation-delay: -3s;
          transform: scale(0.7);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(180deg); }
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }
        .header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          animation: slideInDown 0.6s ease-out;
        }
        .logo {
          width: 40px;
          height: 40px;
          margin-right: 1rem;
          background: linear-gradient(45deg, #ffc107, #ffeb3b);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          animation: pulse 2s infinite;
        }
        .logo svg {
          width: 24px;
          height: 24px;
          color: #0a1929;
          z-index: 2;
          animation: shake 3s infinite;
        }
        .logo::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }
        @keyframes pulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 193, 7, 0.4);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(255, 193, 7, 0.7), 0 0 40px rgba(255, 235, 59, 0.4);
            transform: scale(1.05);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        .title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(255, 193, 7, 0.3);
          letter-spacing: -0.02em;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          animation: slideInUp 0.8s ease-out;
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: #ffc107;
          font-size: 1.1rem;
          font-weight: 600;
        }
        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 193, 7, 0.3);
          border-top: 3px solid #ffc107;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 1rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .no-data {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: #ffc107;
          font-weight: 600;
          text-align: center;
        }
        .no-data-icon {
          width: 64px;
          height: 64px;
          color: #ffc107;
          margin-bottom: 1rem;
          opacity: 0.7;
        }
        .disruption-list {
          list-style: none;
          padding: 0;
        }
        .disruption-item {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 235, 59, 0.05));
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-left: 4px solid #ffc107;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
          position: relative;
          overflow: hidden;
        }
        .disruption-item:nth-child(1) { animation-delay: 0.1s; }
        .disruption-item:nth-child(2) { animation-delay: 0.2s; }
        .disruption-item:nth-child(3) { animation-delay: 0.3s; }
        .disruption-item:nth-child(4) { animation-delay: 0.4s; }
        .disruption-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #ffc107, #ffeb3b, #ffc107);
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .disruption-item:hover {
          transform: translateY(-3px) translateX(5px);
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 235, 59, 0.08));
          border-color: rgba(255, 193, 7, 0.5);
          box-shadow: 
            0 8px 25px rgba(255, 193, 7, 0.2),
            0 4px 10px rgba(0, 0, 0, 0.3);
        }
        .disruption-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #ffc107;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .disruption-title svg {
          margin-right: 0.75rem;
          color: #ffc107;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }
        .disruption-detail {
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.75rem;
          line-height: 1.6;
          font-size: 0.95rem;
        }
        .disruption-detail:last-child {
          margin-bottom: 0;
        }
        .disruption-label {
          font-weight: 600;
          color: #ffeb3b;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        .severity-high {
          border-left-color: #f44336;
        }
        .severity-high .disruption-title {
          color: #ff6b6b;
        }
        .severity-medium {
          border-left-color: #ff9800;
        }
        .severity-medium .disruption-title {
          color: #ffb74d;
        }
        .severity-low {
          border-left-color: #ffc107;
        }
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
          .title {
            font-size: 2rem;
          }
          .glass-card {
            padding: 1.5rem;
            border-radius: 16px;
          }
          .disruption-item {
            padding: 1rem;
            margin-bottom: 1rem;
          }
          .disruption-title {
            font-size: 1.1rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .floating-circle,
          .floating-triangle {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .header {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          .logo {
            width: 48px;
            height: 48px;
            margin-right: 0;
          }
          .title {
            font-size: 1.75rem;
          }
          .glass-card {
            padding: 1rem;
          }
          .disruption-detail {
            font-size: 0.9rem;
          }
        }
        .warning-glow {
          animation: warningGlow 2s ease-in-out infinite alternate;
        }
        @keyframes warningGlow {
          from {
            box-shadow: 0 0 5px rgba(255, 193, 7, 0.2);
          }
          to {
            box-shadow: 0 0 20px rgba(255, 193, 7, 0.4), 0 0 30px rgba(255, 193, 7, 0.2);
          }
        }
      `}</style>
    </>
  );
};

export default Disruption;