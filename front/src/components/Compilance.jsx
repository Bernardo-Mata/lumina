import React, { useEffect, useState } from 'react';
import { CheckSquare } from 'lucide-react';

const Compilance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompliance = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user_compliance", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (res.ok) {
          const complianceData = await res.json();
          setData({ summary: complianceData.map(c => c.summary) });
        } else {
          setData({ error: "No se pudo obtener la información de compliance.", raw: await res.text() });
        }
      } catch (err) {
        setData({ error: "Error loading compliance: " + err.message });
      }
      setLoading(false);
    };
    fetchCompliance();
  }, []);

  const summary = data && Array.isArray(data.summary) ? data.summary : [];

  return (
    <>
      <div className="floating-elements">
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
      </div>
      <div className="container">
        <div className="header">
          <div className="logo">
            <CheckSquare size={24} />
          </div>
          <h1 className="title">Compliance</h1>
        </div>
        <div className="glass-card">
          <h2 className="card-title">
            <CheckSquare size={24} />
            Compliance Overview
          </h2>
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              Loading compliance summary...
            </div>
          ) : data && data.error ? (
            <div className="error">
              {data.error}
              {data.raw && <div className="error-details">{data.raw}</div>}
            </div>
          ) : summary.length === 0 ? (
            <div className="no-data">
              No compliance summary available.
            </div>
          ) : (
            <ul className="compliance-list">
              {summary.map((item, idx) => (
                <li className="compliance-item" key={idx}>
                  <CheckSquare className="compliance-icon" size={20} />
                  <span className="compliance-text">{item}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="footer-note">
            For more details, check the documents and audits section.
          </div>
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
          background: linear-gradient(45deg, rgba(64, 224, 255, 0.1), rgba(128, 255, 255, 0.05));
          animation: float 6s ease-in-out infinite;
        }
        .floating-circle:nth-child(1) {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 80%;
          animation-delay: -2s;
        }
        .floating-circle:nth-child(2) {
          width: 150px;
          height: 150px;
          top: 60%;
          left: 10%;
          animation-delay: -4s;
        }
        .floating-circle:nth-child(3) {
          width: 100px;
          height: 100px;
          top: 30%;
          left: 20%;
          animation-delay: -1s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
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
          background: linear-gradient(45deg, #40e0ff, #80ffff);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          animation: shimmer 2s infinite;
        }
        .logo svg {
          width: 24px;
          height: 24px;
          color: #0a1929;
          z-index: 2;
        }
        .logo::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }
        @keyframes shimmer {
          0%, 100% { box-shadow: 0 0 20px rgba(64, 224, 255, 0.3); }
          50% { box-shadow: 0 0 30px rgba(64, 224, 255, 0.6), 0 0 40px rgba(128, 255, 255, 0.3); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        .title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(64, 224, 255, 0.3);
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
        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
        }
        .card-title svg {
          margin-right: 0.75rem;
          color: #40e0ff;
        }
        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
        }
        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(64, 224, 255, 0.3);
          border-top: 3px solid #40e0ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 1rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .error {
          color: #ff6b8a;
          background: rgba(255, 107, 138, 0.1);
          border: 1px solid rgba(255, 107, 138, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }
        .error-details {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          white-space: pre-wrap;
          color: rgba(255, 255, 255, 0.8);
        }
        .compliance-list {
          list-style: none;
          padding: 0;
        }
        .compliance-item {
          background: linear-gradient(135deg, rgba(64, 224, 255, 0.1), rgba(128, 255, 255, 0.05));
          border: 1px solid rgba(64, 224, 255, 0.3);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
        }
        .compliance-item:nth-child(1) { animation-delay: 0.1s; }
        .compliance-item:nth-child(2) { animation-delay: 0.2s; }
        .compliance-item:nth-child(3) { animation-delay: 0.3s; }
        .compliance-item:nth-child(4) { animation-delay: 0.4s; }
        .compliance-item:hover {
          transform: translateX(8px);
          background: linear-gradient(135deg, rgba(64, 224, 255, 0.2), rgba(128, 255, 255, 0.1));
          border-color: rgba(64, 224, 255, 0.5);
          box-shadow: 0 4px 20px rgba(64, 224, 255, 0.2);
        }
        .compliance-icon {
          color: #40e0ff;
          margin-right: 1rem;
          flex-shrink: 0;
        }
        .compliance-text {
          color: #ffffff;
          font-size: 1rem;
          line-height: 1.5;
        }
        .no-data {
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
          padding: 2rem;
        }
        .footer-note {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          font-style: italic;
          text-align: center;
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
          .card-title {
            font-size: 1.25rem;
            margin-bottom: 1rem;
          }
          .compliance-item {
            padding: 0.75rem 1rem;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }
          .compliance-icon {
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
          }
          .floating-circle {
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
        }
      `}</style>
    </>
  );
};

export default Compilance;