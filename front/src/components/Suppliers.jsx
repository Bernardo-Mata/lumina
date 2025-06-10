import React, { useEffect, useState } from 'react';
import { Server } from 'lucide-react';

// Helper para formatear el risk score como porcentaje
const formatRiskScore = (score) => {
  if (typeof score !== 'number') return '-';
  return `${(score).toFixed(2)}%`;
};

const riskBadgeClass = (score) => {
  if (typeof score !== 'number') return 'risk-badge';
  if (score >= 80) return 'risk-badge risk-high';
  if (score >= 50) return 'risk-badge risk-medium';
  return 'risk-badge risk-low';
};

const statusBadgeClass = (status) => {
  if (!status) return 'status-badge';
  return status.toLowerCase() === 'active'
    ? 'status-badge status-active'
    : 'status-badge status-inactive';
};

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Para animación de aparición
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    setTimeout(() => setShow(true), 50); // Pequeño delay para animación

    const fetchSuppliers = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user_suppliers", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (res.ok) {
          const data = await res.json();
          setSuppliers(Array.isArray(data) ? data : []);
        } else {
          setError("No se pudieron obtener los suppliers.");
        }
      } catch (err) {
        setError("Error loading suppliers " + err.message);
      }
      setLoading(false);
    };
    fetchSuppliers();
  }, []);

  return (
    <>
      <div className="floating-elements">
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
      </div>
      <div className={`container suppliers-appear ${show ? 'suppliers-appear-active' : ''}`}>
        <div className="header">
          <div className="logo-icon"></div>
          <h1>LUMINA Suppliers</h1>
        </div>
        <div className="glass-card">
          <h3 className="card-title">Supplier Management Dashboard</h3>
          <div className="table-container">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading suppliers...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>⚠️ {error}</p>
              </div>
            ) : suppliers.length === 0 ? (
              <div className="empty-state">
                <p>📦 No suppliers available at the moment.</p>
              </div>
            ) : (
              <table className="suppliers-table">
                <thead>
                  <tr>
                    <th>Supplier Name</th>
                    <th>Location</th>
                    <th>Risk Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier, idx) => (
                    <tr key={supplier.id || idx}>
                      <td className="supplier-name">{supplier.name}</td>
                      <td>{supplier.location}</td>
                      <td>
                        <span className={riskBadgeClass(supplier.risk_score)}>
                          {formatRiskScore(supplier.risk_score)}
                        </span>
                      </td>
                      <td>
                        <span className={statusBadgeClass(supplier.status)}>
                          {supplier.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
          z-index: 1;
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
          left: 10%;
          animation-delay: 0s;
        }
        .floating-circle:nth-child(2) {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }
        .floating-circle:nth-child(3) {
          width: 100px;
          height: 100px;
          bottom: 20%;
          left: 50%;
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .container {
          position: relative;
          z-index: 2;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(64, 224, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .logo-icon {
          width: 48px;
          height: 48px;
          margin-right: 1rem;
          background: linear-gradient(45deg, #40e0ff, #80ffff);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          animation: logoGlow 3s ease-in-out infinite;
        }
        .logo-icon::before {
          content: '⚡';
          font-size: 24px;
          color: #0a1929;
          font-weight: bold;
        }
        @keyframes logoGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(64, 224, 255, 0.5);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(64, 224, 255, 0.8);
            transform: scale(1.05);
          }
        }
        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #40e0ff, #80ffff, #ffffff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(64, 224, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          padding: 2rem;
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          border-color: rgba(64, 224, 255, 0.4);
        }
        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #80ffff;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 10px rgba(128, 255, 255, 0.3);
        }
        .table-container {
          overflow-x: auto;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(64, 224, 255, 0.1);
        }
        .suppliers-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        }
        .suppliers-table thead {
          background: linear-gradient(135deg, rgba(64, 224, 255, 0.15), rgba(128, 255, 255, 0.1));
        }
        .suppliers-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #80ffff;
          border-bottom: 2px solid rgba(64, 224, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.85rem;
        }
        .suppliers-table tbody tr {
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.3s ease;
          border-bottom: 1px solid rgba(64, 224, 255, 0.1);
        }
        .suppliers-table tbody tr:nth-child(even) {
          background: rgba(64, 224, 255, 0.03);
        }
        .suppliers-table tbody tr:hover {
          background: rgba(64, 224, 255, 0.08);
          transform: scale(1.01);
          box-shadow: 0 4px 16px rgba(64, 224, 255, 0.1);
        }
        .suppliers-table td {
          padding: 1rem;
          color: #ffffff;
          vertical-align: middle;
        }
        .supplier-name {
          font-weight: 600;
          color: #80ffff;
        }
        .risk-badge, .status-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .risk-badge:hover, .status-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .risk-low {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          border-color: rgba(34, 197, 94, 0.4);
        }
        .risk-medium {
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
          border-color: rgba(251, 191, 36, 0.4);
        }
        .risk-high {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.4);
        }
        .status-active {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          border-color: rgba(34, 197, 94, 0.4);
        }
        .status-inactive {
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
          border-color: rgba(156, 163, 175, 0.4);
        }
        .loading-state, .error-state, .empty-state {
          text-align: center;
          padding: 3rem;
          color: #80ffff;
          font-size: 1.1rem;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(64, 224, 255, 0.3);
          border-top: 3px solid #40e0ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
          .header {
            flex-direction: column;
            text-align: center;
            padding: 1rem;
          }
          .header h1 {
            font-size: 2rem;
            margin-top: 0.5rem;
          }
          .logo-icon {
            margin-right: 0;
            margin-bottom: 0.5rem;
          }
          .glass-card {
            padding: 1rem;
          }
          .suppliers-table {
            font-size: 0.85rem;
          }
          .suppliers-table th,
          .suppliers-table td {
            padding: 0.75rem 0.5rem;
          }
          .floating-circle {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .header h1 {
            font-size: 1.5rem;
          }
          .card-title {
            font-size: 1.2rem;
          }
          .risk-badge, .status-badge {
            padding: 0.3rem 0.6rem;
            font-size: 0.7rem;
          }
        }
        .suppliers-appear {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(.4,0,.2,1), transform 0.8s cubic-bezier(.4,0,.2,1);
        }
        .suppliers-appear-active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </>
  );
};

export default Suppliers;