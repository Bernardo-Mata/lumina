import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboards = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user_dashboards", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (res.ok) {
          const data = await res.json();
          setDashboardData(Array.isArray(data) && data.length > 0 ? data[data.length - 1] : {});
        } else {
          setDashboardData({});
        }
      } catch (err) {
        setDashboardData({});
      }
      setLoading(false);
    };
    fetchDashboards();
  }, []);

  if (loading) {
    return (
      <>
        <style>{`
          .dashboard-loading-state {
            text-align: center;
            padding: 4rem;
            font-size: 1.2rem;
            color: #2563eb;
            position: relative;
            z-index: 1;
          }
          .dashboard-loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #93c5fd;
            border-top: 3px solid #2563eb;
            border-radius: 50%;
            animation: dashboard-spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes dashboard-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div className="dashboard-loading-state">
          <div className="dashboard-loading-spinner"></div>
          <div>Generando insights...</div>
        </div>
      </>
    );
  }

  if (!dashboardData || Object.keys(dashboardData).length === 0) {
    return (
      <div className="dashboard-loading-state">
        <div>No hay datos de dashboard disponibles.</div>
      </div>
    );
  }

  // Helper para mostrar valores
  const showValue = (val) => val !== undefined && val !== null ? val : '-';

  // Bar chart for region distribution
  const regionDist = dashboardData.supplier_region_distribution || {};
  const regionBarData = {
    labels: Object.keys(regionDist),
    datasets: [
      {
        label: 'Suppliers by Region',
        data: Object.values(regionDist),
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(37, 99, 235, 0.6)',
          'rgba(59, 130, 246, 0.6)'
        ],
        borderColor: [
          'rgba(37, 99, 235, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(37, 99, 235, 1)',
          'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  // Pie chart for supplier status
  const suppliers = Array.isArray(dashboardData.suppliers) ? dashboardData.suppliers : [];
  const statusCounts = suppliers.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});
  const statusPieData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Supplier Status',
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 66, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(37, 99, 235, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(245, 158, 66, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(37, 99, 235, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Bar chart for risk score distribution (grouped by 0-20, 21-40, etc.)
  const riskBuckets = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
  suppliers.forEach(s => {
    if (typeof s.risk_score === 'number') {
      if (s.risk_score <= 20) riskBuckets['0-20']++;
      else if (s.risk_score <= 40) riskBuckets['21-40']++;
      else if (s.risk_score <= 60) riskBuckets['41-60']++;
      else if (s.risk_score <= 80) riskBuckets['61-80']++;
      else riskBuckets['81-100']++;
    }
  });
  const riskBarData = {
    labels: Object.keys(riskBuckets),
    datasets: [
      {
        label: 'Suppliers by Risk Score',
        data: Object.values(riskBuckets),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 66, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(245, 158, 66, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#2563eb'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(37, 99, 235, 0.1)'
        },
        ticks: {
          color: '#2563eb'
        }
      },
      x: {
        grid: {
          color: 'rgba(37, 99, 235, 0.1)'
        },
        ticks: {
          color: '#2563eb'
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#2563eb',
          padding: 20
        }
      }
    }
  };

  const renderList = (arr) =>
    Array.isArray(arr) && arr.length > 0
      ? arr.map((item, idx) => (
          <li key={idx} className="dashboard-list-item">{item}</li>
        ))
      : <li className="dashboard-no-data">No data</li>;

  return (
    <>
      <style>{`
        .dashboard-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f9fafb;
          min-height: 100vh;
          color: #111827;
          position: relative;
          padding: 2rem 0;
          max-width: 1200px;
          margin: 0 auto;
        }
        .dashboard-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 0.5rem;
          letter-spacing: 0.01em;
        }
        .dashboard-subtitle {
          font-size: 1.1rem;
          color: #64748b;
        }
        .dashboard-kpi-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 768px) {
          .dashboard-kpi-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .dashboard-kpi-card {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 8px #0001;
          border: 1px solid #e5e7eb;
          padding: 2rem 1.5rem;
          text-align: center;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .dashboard-kpi-card:hover {
          box-shadow: 0 8px 24px #2563eb22;
          transform: translateY(-4px) scale(1.02);
        }
        .dashboard-kpi-value {
          font-size: 2rem;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 0.5rem;
        }
        .dashboard-kpi-label {
          font-size: 1rem;
          color: #64748b;
          font-weight: 500;
        }
        .dashboard-section {
          margin-bottom: 2.5rem;
        }
        .dashboard-section-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 1.2rem;
          text-align: center;
        }
        .dashboard-chart-container {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 8px #0001;
          border: 1px solid #e5e7eb;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        .dashboard-table-container {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 8px #0001;
          border: 1px solid #e5e7eb;
          padding: 1.5rem;
          overflow-x: auto;
          margin-bottom: 2rem;
        }
        .dashboard-data-table {
          width: 100%;
          border-collapse: collapse;
          color: #111827;
          font-size: 0.95rem;
        }
        .dashboard-data-table th {
          background: #eff6ff;
          color: #2563eb;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #2563eb33;
        }
        .dashboard-data-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.2s;
        }
        .dashboard-data-table tr:hover td {
          background: #f1f5f9;
        }
        .dashboard-list-container {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 8px #0001;
          border: 1px solid #e5e7eb;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .dashboard-data-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .dashboard-list-item {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.2s;
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }
        .dashboard-list-item:hover {
          background: #f1f5f9;
        }
        .dashboard-list-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .dashboard-no-data {
          color: #64748b;
          font-style: italic;
          text-align: center;
          padding: 2rem;
        }
        /* Responsive */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem 0.25rem;
          }
          .dashboard-title {
            font-size: 1.5rem;
          }
          .dashboard-kpi-value {
            font-size: 1.3rem;
          }
          .dashboard-section-title {
            font-size: 1.1rem;
          }
          .dashboard-chart-container,
          .dashboard-table-container,
          .dashboard-list-container {
            padding: 1rem;
          }
        }
      `}</style>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Supply Chain Dashboard</h1>
          <p className="dashboard-subtitle">Monitoreo en tiempo real de la cadena de suministro</p>
        </div>

        {/* KPIs */}
        <div className="dashboard-kpi-grid">
          <div className="dashboard-kpi-card">
            <div className="dashboard-kpi-value">{showValue(dashboardData.total_suppliers)}</div>
            <div className="dashboard-kpi-label">Total Suppliers</div>
          </div>
          <div className="dashboard-kpi-card">
            <div className="dashboard-kpi-value">{showValue(dashboardData.average_risk_score)}</div>
            <div className="dashboard-kpi-label">Average Risk Score</div>
          </div>
          <div className="dashboard-kpi-card">
            <div className="dashboard-kpi-value">{showValue(dashboardData.on_time_delivery_percentage)}%</div>
            <div className="dashboard-kpi-label">On-Time Delivery %</div>
          </div>
          <div className="dashboard-kpi-card">
            <div className="dashboard-kpi-value">{showValue(dashboardData.compliance_issues_count)}</div>
            <div className="dashboard-kpi-label">Compliance Issues</div>
          </div>
          <div className="dashboard-kpi-card">
            <div className="dashboard-kpi-value">{showValue(dashboardData.high_risk_suppliers_count)}</div>
            <div className="dashboard-kpi-label">High Risk Suppliers</div>
          </div>
          <div className="dashboard-kpi-card">
            <div className="dashboard-kpi-value">{showValue(dashboardData.average_delivery_delay_days)}</div>
            <div className="dashboard-kpi-label">Avg. Delivery Delay (days)</div>
          </div>
          <div className="dashboard-kpi-card">
            <div className="dashboard-kpi-value">{showValue(dashboardData.financial_risk_score)}</div>
            <div className="dashboard-kpi-label">Financial Risk Score</div>
          </div>
          <div className="dashboard-kpi-card">
            <div className="dashboard-kpi-value">{showValue(dashboardData.inventory_turnover_rate)}</div>
            <div className="dashboard-kpi-label">Inventory Turnover Rate</div>
          </div>
        </div>

        {/* Additional KPIs Row */}
        <div className="dashboard-kpi-grid" style={{ marginBottom: "2.5rem" }}>
          <div className="dashboard-kpi-card">
            <div className="dashboard-kpi-value">{showValue(dashboardData.supplier_dependency_index)}</div>
            <div className="dashboard-kpi-label">Supplier Dependency Index</div>
          </div>
          <div className="dashboard-kpi-card">
            <div className="dashboard-kpi-value">{showValue(dashboardData.esg_non_compliance_count)}</div>
            <div className="dashboard-kpi-label">ESG Non-Compliance</div>
          </div>
          <div className="dashboard-kpi-card">
            <div className="dashboard-kpi-value">{showValue(dashboardData.last_incident_date)}</div>
            <div className="dashboard-kpi-label">Last Incident Date</div>
          </div>
        </div>

        {/* Supplier Region Distribution */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">Distribución de Proveedores por Región</h3>
          <div className="dashboard-chart-container">
            <Bar data={regionBarData} options={chartOptions} />
          </div>
          <div className="dashboard-table-container">
            <table className="dashboard-data-table">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(regionDist).map(([region, count]) => (
                  <tr key={region}>
                    <td>{region}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supplier Status Pie Chart */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">Distribución de Estado de Proveedores</h3>
          <div className="dashboard-chart-container" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 300, height: 300 }}>
              <Pie data={statusPieData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* Risk Score Distribution Bar Chart */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">Distribución de Puntuación de Riesgo</h3>
          <div className="dashboard-chart-container">
            <Bar data={riskBarData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">Alertas Recientes</h3>
          <div className="dashboard-list-container">
            <ul className="dashboard-data-list">
              {renderList(dashboardData.recent_alerts)}
            </ul>
          </div>
        </div>

        {/* Critical Materials Shortage */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">Escasez de Materiales Críticos</h3>
          <div className="dashboard-list-container">
            <ul className="dashboard-data-list">
              {renderList(dashboardData.critical_materials_shortage)}
            </ul>
          </div>
        </div>

        {/* Supply Chain Disruption Events */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">Eventos de Disrupción en la Cadena de Suministro</h3>
          <div className="dashboard-list-container">
            <ul className="dashboard-data-list">
              {renderList(dashboardData.supply_chain_disruption_events)}
            </ul>
          </div>
        </div>

        {/* Suppliers Table */}
        {Array.isArray(dashboardData.suppliers) && dashboardData.suppliers.length > 0 && (
          <div className="dashboard-section">
            <h3 className="dashboard-section-title">Tabla de Proveedores</h3>
            <div className="dashboard-table-container">
              <table className="dashboard-data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Risk Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.suppliers.map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.name}</td>
                      <td>{s.location}</td>
                      <td>{s.risk_score}</td>
                      <td>{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;