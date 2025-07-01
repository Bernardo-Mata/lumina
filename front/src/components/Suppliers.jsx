import React, { useEffect, useState } from 'react';

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
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    setTimeout(() => setShow(true), 50);

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
      <style>{`
        .suppliers-bg {
          min-height: 100vh;
          background: #f9fafb;
          padding: 2rem 0;
        }
        .suppliers-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .suppliers-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .suppliers-logo {
          width: 2.5rem;
          height: 2.5rem;
          background: #2563eb;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .suppliers-logo-icon {
          color: #fff;
          font-size: 1.5rem;
          font-weight: bold;
        }
        .suppliers-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.01em;
        }
        .suppliers-card {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 8px #0001;
          border: 1px solid #e5e7eb;
          padding: 2rem 1.5rem;
          margin-bottom: 2rem;
        }
        .suppliers-card-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .suppliers-table-container {
          overflow-x: auto;
          border-radius: 1rem;
        }
        .suppliers-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        }
        .suppliers-table thead {
          background: #eff6ff;
        }
        .suppliers-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #2563eb;
          border-bottom: 2px solid #2563eb33;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.85rem;
        }
        .suppliers-table tbody tr {
          background: #fff;
          transition: background-color 0.2s;
          border-bottom: 1px solid #e5e7eb;
        }
        .suppliers-table tbody tr:hover {
          background: #f1f5f9;
        }
        .suppliers-table td {
          padding: 1rem;
          color: #111827;
          vertical-align: middle;
        }
        .supplier-name {
          font-weight: 600;
          color: #2563eb;
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
          transition: all 0.2s;
        }
        .risk-badge:hover, .status-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .risk-low {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border-color: #bbf7d0;
        }
        .risk-medium {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          border-color: #fde68a;
        }
        .risk-high {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border-color: #fecaca;
        }
        .status-active {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border-color: #bbf7d0;
        }
        .status-inactive {
          background: rgba(156, 163, 175, 0.15);
          color: #6b7280;
          border-color: #d1d5db;
        }
        .suppliers-loading, .suppliers-error, .suppliers-empty {
          text-align: center;
          padding: 3rem 0;
          color: #2563eb;
          font-size: 1.1rem;
        }
        .suppliers-spinner {
          width: 40px;
          height: 40px;
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
        @media (max-width: 768px) {
          .suppliers-container {
            padding: 0 0.5rem;
          }
          .suppliers-header {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          .suppliers-title {
            font-size: 1.3rem;
          }
          .suppliers-card {
            padding: 1rem;
          }
          .suppliers-table th,
          .suppliers-table td {
            padding: 0.75rem 0.5rem;
          }
        }
      `}</style>
      <div className="suppliers-bg">
        <div className={`suppliers-container suppliers-appear ${show ? 'suppliers-appear-active' : ''}`}>
          <div className="suppliers-header">
            <div className="suppliers-logo">
              <span className="suppliers-logo-icon">⚡</span>
            </div>
            <h1 className="suppliers-title">LUMINA Suppliers</h1>
          </div>
          <div className="suppliers-card">
            <h3 className="suppliers-card-title">Supplier Management Dashboard</h3>
            <div className="suppliers-table-container">
              {loading ? (
                <div className="suppliers-loading">
                  <div className="suppliers-spinner"></div>
                  <p>Loading suppliers...</p>
                </div>
              ) : error ? (
                <div className="suppliers-error">
                  <p>⚠️ {error}</p>
                </div>
              ) : suppliers.length === 0 ? (
                <div className="suppliers-empty">
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
      </div>
    </>
  );
};

export default Suppliers;