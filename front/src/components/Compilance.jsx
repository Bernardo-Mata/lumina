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
      <style>{`
        .compliance-bg {
          min-height: 100vh;
          background: #f9fafb;
          padding: 2rem 0;
        }
        .compliance-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .compliance-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .compliance-logo {
          width: 2.5rem;
          height: 2.5rem;
          background: #2563eb;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .compliance-logo-icon {
          color: #fff;
          font-size: 1.5rem;
          font-weight: bold;
        }
        .compliance-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.01em;
        }
        .compliance-card {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 8px #0001;
          border: 1px solid #e5e7eb;
          padding: 2rem 1.5rem;
          margin-bottom: 2rem;
        }
        .compliance-card-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .compliance-list {
          list-style: none;
          padding: 0;
        }
        .compliance-item {
          background: #f1f5f9;
          border: 1px solid #e0e7ef;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }
        .compliance-item:hover {
          background: #e0e7ef;
          border-color: #2563eb33;
          box-shadow: 0 4px 20px #2563eb11;
        }
        .compliance-icon {
          color: #2563eb;
          margin-right: 1rem;
          flex-shrink: 0;
        }
        .compliance-text {
          color: #111827;
          font-size: 1rem;
          line-height: 1.5;
        }
        .compliance-loading, .compliance-error, .compliance-empty {
          text-align: center;
          padding: 3rem 0;
          color: #2563eb;
          font-size: 1.1rem;
        }
        .compliance-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #93c5fd;
          border-top: 3px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .compliance-error {
          color: #ef4444;
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }
        .compliance-error-details {
          background: #f3f4f6;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          white-space: pre-wrap;
          color: #334155;
        }
        .compliance-no-data {
          text-align: center;
          color: #64748b;
          font-style: italic;
          padding: 2rem;
        }
        .compliance-footer-note {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
          color: #64748b;
          font-size: 0.95rem;
          font-style: italic;
          text-align: center;
        }
        @media (max-width: 768px) {
          .compliance-container {
            padding: 0 0.5rem;
          }
          .compliance-header {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          .compliance-title {
            font-size: 1.3rem;
          }
          .compliance-card {
            padding: 1rem;
          }
        }
      `}</style>
      <div className="compliance-bg">
        <div className="compliance-container">
          <div className="compliance-header">
            <div className="compliance-logo">
              <CheckSquare size={20} className="compliance-logo-icon" />
            </div>
            <h1 className="compliance-title">Compliance</h1>
          </div>
          <div className="compliance-card">
            <h2 className="compliance-card-title">
              <CheckSquare size={20} className="compliance-icon" />
              Compliance Overview
            </h2>
            {loading ? (
              <div className="compliance-loading">
                <div className="compliance-spinner"></div>
                Cargando resumen de compliance...
              </div>
            ) : data && data.error ? (
              <div className="compliance-error">
                {data.error}
                {data.raw && <div className="compliance-error-details">{data.raw}</div>}
              </div>
            ) : summary.length === 0 ? (
              <div className="compliance-no-data">
                No hay resumen de compliance disponible.
              </div>
            ) : (
              <ul className="compliance-list">
                {summary.map((item, idx) => (
                  <li className="compliance-item" key={idx}>
                    <CheckSquare className="compliance-icon" size={18} />
                    <span className="compliance-text">{item}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="compliance-footer-note">
              Para más detalles, revisa la sección de documentos y auditorías.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Compilance;