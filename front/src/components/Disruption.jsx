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
      <style>{`
        .disruption-bg {
          min-height: 100vh;
          background: #f9fafb;
          padding: 2rem 0;
        }
        .disruption-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .disruption-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .disruption-logo {
          width: 2.5rem;
          height: 2.5rem;
          background: #ffc107;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .disruption-logo-icon {
          color: #fff;
          font-size: 1.5rem;
          font-weight: bold;
        }
        .disruption-title {
          font-size: 2rem;
          font-weight: 700;
          color: #ffc107;
          letter-spacing: 0.01em;
        }
        .disruption-card {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 8px #0001;
          border: 1px solid #ffe082;
          padding: 2rem 1.5rem;
          margin-bottom: 2rem;
        }
        .disruption-card-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #ffc107;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .disruption-list {
          list-style: none;
          padding: 0;
        }
        .disruption-item {
          background: #fffde7;
          border: 1px solid #ffe082;
          border-left: 4px solid #ffc107;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
        }
        .disruption-item:hover {
          background: #fff9c4;
          border-color: #ffd54f;
          box-shadow: 0 8px 25px rgba(255, 193, 7, 0.08), 0 4px 10px rgba(0,0,0,0.08);
        }
        .disruption-title-row {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffc107;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }
        .disruption-title-row svg {
          margin-right: 0.75rem;
          color: #ffc107;
        }
        .disruption-detail {
          color: #333;
          margin-bottom: 0.75rem;
          line-height: 1.6;
          font-size: 0.97rem;
        }
        .disruption-detail:last-child {
          margin-bottom: 0;
        }
        .disruption-label {
          font-weight: 600;
          color: #ff9800;
        }
        .severity-high {
          border-left-color: #f44336;
        }
        .severity-high .disruption-title-row {
          color: #f44336;
        }
        .severity-medium {
          border-left-color: #ff9800;
        }
        .severity-medium .disruption-title-row {
          color: #ff9800;
        }
        .severity-low {
          border-left-color: #ffc107;
        }
        .disruption-loading, .disruption-empty {
          text-align: center;
          padding: 3rem 0;
          color: #ffc107;
          font-size: 1.1rem;
        }
        .disruption-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #ffe082;
          border-top: 3px solid #ffc107;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .disruption-no-data {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: #ffc107;
          font-weight: 600;
          text-align: center;
        }
        .disruption-no-data-icon {
          width: 64px;
          height: 64px;
          color: #ffc107;
          margin-bottom: 1rem;
          opacity: 0.7;
        }
        @media (max-width: 768px) {
          .disruption-container {
            padding: 0 0.5rem;
          }
          .disruption-header {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          .disruption-title {
            font-size: 1.3rem;
          }
          .disruption-card {
            padding: 1rem;
          }
          .disruption-item {
            padding: 1rem;
            margin-bottom: 1rem;
          }
          .disruption-title-row {
            font-size: 1rem;
          }
        }
      `}</style>
      <div className="disruption-bg">
        <div className="disruption-container">
          <div className="disruption-header">
            <div className="disruption-logo">
              <AlertTriangle size={20} className="disruption-logo-icon" />
            </div>
            <h1 className="disruption-title">Disruption</h1>
          </div>
          <div className="disruption-card">
            <h2 className="disruption-card-title">
              <AlertTriangle size={20} style={{ color: "#ffc107" }} />
              Eventos de Disrupción en la Cadena de Suministro
            </h2>
            {loading ? (
              <div className="disruption-loading">
                <div className="disruption-spinner"></div>
                Cargando información de disrupciones...
              </div>
            ) : disruptions.length === 0 ? (
              <div className="disruption-no-data">
                <AlertTriangle className="disruption-no-data-icon" size={64} />
                <div>No hay información de disrupciones disponible.</div>
              </div>
            ) : (
              <ul className="disruption-list">
                {disruptions.map((d, idx) => {
                  let severity = '';
                  if (d.severity === 'high') severity = 'severity-high';
                  else if (d.severity === 'medium') severity = 'severity-medium';
                  else if (d.severity === 'low') severity = 'severity-low';
                  return (
                    <li className={`disruption-item ${severity}`} key={idx}>
                      <div className="disruption-title-row">
                        <AlertTriangle size={20} />
                        {d.summary || "Disruption detected"}
                      </div>
                      {d.causes && (
                        <div className="disruption-detail">
                          <span className="disruption-label">Causas:</span> {d.causes}
                        </div>
                      )}
                      {d.affected_suppliers && (
                        <div className="disruption-detail">
                          <span className="disruption-label">Proveedores afectados:</span> {d.affected_suppliers}
                        </div>
                      )}
                      {d.recommendations && (
                        <div className="disruption-detail">
                          <span className="disruption-label">Recomendaciones:</span> {d.recommendations}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Disruption;