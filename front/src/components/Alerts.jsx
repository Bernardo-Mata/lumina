import React, { useEffect, useState } from 'react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user_alerts", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (res.ok) {
          // Si la respuesta es un string JSON, parsea primero
          let data = await res.json();
          if (typeof data === "string") {
            try {
              data = JSON.parse(data);
            } catch (e) {
              data = [];
            }
          }
          // Si el JSON tiene una propiedad 'alerts', úsala
          if (data && data.alerts) {
            setAlerts(data.alerts);
          } else {
            setAlerts(data);
          }
        } else {
          setAlerts([]);
        }
      } catch (err) {
        setAlerts([]);
      }
      setLoading(false);
    };
    fetchAlerts();
  }, []);

  // Agrupa alertas por prioridad
  const groupedAlerts = {
    High: [],
    Medium: [],
    Low: [],
  };
  alerts.forEach(alert => {
    if (alert.priority === "High") groupedAlerts.High.push(alert);
    else if (alert.priority === "Medium") groupedAlerts.Medium.push(alert);
    else groupedAlerts.Low.push(alert);
  });

  const renderAlert = (alert, idx, priority) => (
    <div
      key={idx}
      className={`alert-card ${priority.toLowerCase()}`}
    >
      <div className="alert-header">
        <span className="alert-sku">{alert.sku || '-'}</span>
        <span className={`priority-badge ${priority.toLowerCase()}`}>
          {priority === "High"
            ? "Alta Prioridad"
            : priority === "Medium"
            ? "Prioridad Media"
            : "Prioridad Baja"}
        </span>
      </div>
      <div className="alert-grid">
        <div className="alert-field">
          <span className="label">Tipo:</span>
          <span className="value">{alert.product_type || '-'}</span>
        </div>
        <div className="alert-field">
          <span className="label">Disponibilidad:</span>
          <span className="value">{alert.availability ?? alert.stock_levels ?? '-'}</span>
        </div>
        <div className="alert-field">
          <span className="label">Tiempo de Entrega:</span>
          <span className="value">{alert.lead_time ?? '-'}</span>
        </div>
        <div className="alert-field">
          <span className="label">Tipo de Riesgo:</span>
          <span className="value">{alert.risk_type || '-'}</span>
        </div>
      </div>
      <div className="alert-description">
        {alert.description || '-'}
      </div>
      {alert.risk_reason && (
        <div className="risk-reason-container">
          <span className="risk-reason-title">Motivo del Riesgo:</span>
          <span className="risk-reason-text">{alert.risk_reason}</span>
        </div>
      )}
      {alert.solutions && (
        <div className="solutions-container">
          <span className="solutions-title">Soluciones Recomendadas:</span>
          <ul className="solutions-list">
            {Array.isArray(alert.solutions)
              ? alert.solutions.map((sol, i) => <li key={i}>{sol}</li>)
              : <li>{alert.solutions}</li>}
          </ul>
        </div>
      )}
    </div>
  );

  if (loading)
    return <div className="loading">Cargando alertas...</div>;
  if (!alerts || alerts.length === 0)
    return <div className="no-data">No hay alertas para mostrar.</div>;

  return (
    <>
      {/* Floating background elements */}
      <div className="bg-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      {/* Header */}
      <div className="header">
        <div className="logo">LUMINA</div>
        <div className="subtitle">Advanced Supply Chain Intelligence</div>
      </div>

      {/* Main container */}
      <div className="container">
        <div className="glass-container">
          <h2 className="main-title">Dashboard de Alertas Detalladas</h2>

          {/* Problem Summary */}
          <div className="problem-summary">
            <span className="label">Resumen del Problema:</span>
            <span className="text">
              Se han detectado múltiples alertas críticas en la cadena de suministro que requieren atención inmediata para mantener la operación óptima.
            </span>
          </div>

          {/* High Priority */}
          <div className="priority-section">
            <h3 className="priority-title high">
              <span className="priority-dot high"></span>
              Alta Prioridad
            </h3>
            {groupedAlerts.High.length > 0
              ? groupedAlerts.High.map((alert, idx) => renderAlert(alert, idx, "High"))
              : <div className="no-data">Sin alertas de alta prioridad.</div>}
          </div>

          {/* Medium Priority */}
          <div className="priority-section">
            <h3 className="priority-title medium">
              <span className="priority-dot medium"></span>
              Prioridad Media
            </h3>
            {groupedAlerts.Medium.length > 0
              ? groupedAlerts.Medium.map((alert, idx) => renderAlert(alert, idx, "Medium"))
              : <div className="no-data">Sin alertas de prioridad media.</div>}
          </div>

          {/* Low Priority */}
          <div className="priority-section">
            <h3 className="priority-title low">
              <span className="priority-dot low"></span>
              Prioridad Baja
            </h3>
            {groupedAlerts.Low.length > 0
              ? groupedAlerts.Low.map((alert, idx) => renderAlert(alert, idx, "Low"))
              : <div className="no-data">Sin alertas de prioridad baja.</div>}
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
        .bg-elements {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }
        .floating-element {
            position: absolute;
            background: rgba(64, 224, 255, 0.1);
            border-radius: 50%;
            animation: float 15s infinite linear;
        }
        .floating-element:nth-child(1) {
            width: 80px;
            height: 80px;
            top: 20%;
            left: 10%;
            animation-delay: 0s;
        }
        .floating-element:nth-child(2) {
            width: 120px;
            height: 120px;
            top: 60%;
            right: 15%;
            animation-delay: 5s;
        }
        .floating-element:nth-child(3) {
            width: 60px;
            height: 60px;
            top: 80%;
            left: 20%;
            animation-delay: 10s;
        }
        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.3;
            }
            50% {
                transform: translateY(-30px) rotate(180deg);
                opacity: 0.7;
            }
        }
        .header {
            text-align: center;
            padding: 2rem 1rem;
            position: relative;
            z-index: 10;
        }
        .logo {
            font-size: 2.5rem;
            font-weight: 700;
            color: #40e0ff;
            text-shadow: 0 0 20px rgba(64, 224, 255, 0.5);
            animation: glow 2s ease-in-out infinite alternate;
            margin-bottom: 0.5rem;
        }
        @keyframes glow {
            from {
                text-shadow: 0 0 20px rgba(64, 224, 255, 0.5);
            }
            to {
                text-shadow: 0 0 30px rgba(64, 224, 255, 0.8), 0 0 40px rgba(128, 255, 255, 0.3);
            }
        }
        .subtitle {
            color: #80ffff;
            font-size: 1.1rem;
            font-weight: 300;
            opacity: 0.9;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            position: relative;
            z-index: 10;
        }
        .glass-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.8s ease-out;
        }
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .main-title {
            font-size: 2rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 1.5rem;
            text-align: center;
        }
        .problem-summary {
            background: rgba(255, 193, 7, 0.2);
            border-left: 4px solid #ffc107;
            padding: 1rem;
            margin-bottom: 2rem;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            animation: fadeIn 0.6s ease-out 0.2s both;
        }
        .problem-summary .label {
            font-weight: 600;
            color: #fff3cd;
        }
        .problem-summary .text {
            color: #ffffff;
            opacity: 0.9;
        }
        .priority-section {
            margin-bottom: 2rem;
            animation: fadeIn 0.6s ease-out both;
        }
        .priority-section:nth-child(2) { animation-delay: 0.1s; }
        .priority-section:nth-child(3) { animation-delay: 0.2s; }
        .priority-section:nth-child(4) { animation-delay: 0.3s; }
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        .priority-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            text-transform: capitalize;
        }
        .priority-title.high { color: #ff6b6b; }
        .priority-title.medium { color: #ffd93d; }
        .priority-title.low { color: #4ecdc4; }
        .priority-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 0.75rem;
            animation: pulse 2s ease-in-out infinite;
        }
        .priority-dot.high { background: #ff6b6b; }
        .priority-dot.medium { background: #ffd93d; }
        .priority-dot.low { background: #4ecdc4; }
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.2);
                opacity: 0.7;
            }
        }
        .alert-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            border-radius: 15px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        .alert-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            transition: width 0.3s ease;
        }
        .alert-card.high::before { background: #ff6b6b; }
        .alert-card.medium::before { background: #ffd93d; }
        .alert-card.low::before { background: #4ecdc4; }
        .alert-card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            border-color: rgba(64, 224, 255, 0.5);
        }
        .alert-card:hover::before {
            width: 8px;
        }
        .alert-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .alert-sku {
            font-size: 1.2rem;
            font-weight: 700;
            color: #ffffff;
        }
        .priority-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #ffffff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .priority-badge.high { background: linear-gradient(135deg, #ff6b6b, #ff5252); }
        .priority-badge.medium { background: linear-gradient(135deg, #ffd93d, #ffb300); }
        .priority-badge.low { background: linear-gradient(135deg, #4ecdc4, #26a69a); }
        .alert-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .alert-field {
            color: #ffffff;
        }
        .alert-field .label {
            font-weight: 600;
            color: #80ffff;
            margin-right: 0.5rem;
        }
        .alert-field .value {
            opacity: 0.9;
        }
        .alert-description {
            color: #ffffff;
            opacity: 0.8;
            font-style: italic;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 1rem;
            margin-bottom: 1rem;
            line-height: 1.5;
        }
        .solutions-container {
            background: rgba(76, 175, 80, 0.2);
            border: 1px solid rgba(76, 175, 80, 0.3);
            border-radius: 10px;
            padding: 1rem;
            margin-top: 1rem;
        }
        .solutions-title {
            font-weight: 600;
            color: #81c784;
            margin-bottom: 0.5rem;
            display: block;
        }
        .solutions-list {
            list-style: none;
            padding: 0;
        }
        .solutions-list li {
            color: #ffffff;
            opacity: 0.9;
            margin-bottom: 0.3rem;
            padding-left: 1rem;
            position: relative;
        }
        .solutions-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #81c784;
            font-weight: bold;
        }
        .loading {
            text-align: center;
            padding: 3rem;
            color: #80ffff;
            font-size: 1.1rem;
        }
        .loading::after {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #80ffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
            margin-left: 0.5rem;
        }
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
        .no-data {
            text-align: center;
            padding: 3rem;
            color: #ffffff;
            opacity: 0.7;
            font-size: 1.1rem;
        }
        .error {
            text-align: center;
            padding: 3rem;
            color: #ff6b6b;
            font-size: 1.1rem;
        }
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            .glass-container {
                padding: 1.5rem;
                border-radius: 15px;
            }
            .logo {
                font-size: 2rem;
            }
            .main-title {
                font-size: 1.5rem;
            }
            .alert-grid {
                grid-template-columns: 1fr;
                gap: 0.5rem;
            }
            .alert-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
            .priority-title {
                font-size: 1.1rem;
            }
            .floating-element {
                display: none;
            }
        }
        @media (max-width: 480px) {
            .header {
                padding: 1rem;
            }
            .glass-container {
                padding: 1rem;
            }
            .alert-card {
                padding: 1rem;
            }
        }
        .risk-reason-container {
          background: rgba(255, 193, 7, 0.13);
          border-left: 4px solid #ffc107;
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
          border-radius: 8px;
          backdrop-filter: blur(6px);
        }
        .risk-reason-title {
          font-weight: 600;
          color: #ffc107;
          margin-right: 0.5rem;
        }
        .risk-reason-text {
          color: #fff;
          opacity: 0.95;
        }
      `}</style>
    </>
  );
};

export default Alerts;