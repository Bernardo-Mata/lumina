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

// Configure Chart.js defaults for dark theme
ChartJS.defaults.color = '#ffffff';
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

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
          // Toma el dashboard más reciente si hay varios
          setDashboardData(Array.isArray(data) && data.length > 0 ? data[data.length - 1] : {});
          console.log("Dashboard data fetched:", data);
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
      <div className="lumina-loading-state">
        <div className="lumina-loading-spinner"></div>
        <div>Generating insights...</div>
      </div>
    );
  }

  if (!dashboardData || Object.keys(dashboardData).length === 0) {
    return (
      <div className="lumina-loading-state">
        <div>No dashboard data available.</div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="lumina-dashboard-container">
        <div className="lumina-floating-elements">
          <div className="lumina-floating-element"></div>
          <div className="lumina-floating-element"></div>
          <div className="lumina-floating-element"></div>
        </div>
        <div className="lumina-error-state">
          <div className="text-red-500">{dashboardData.error}</div>
          <pre className="bg-white text-black p-2 rounded mt-2">{dashboardData.raw}</pre>
        </div>
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
          'rgba(64, 224, 255, 0.8)',
          'rgba(128, 255, 255, 0.8)',
          'rgba(64, 224, 255, 0.6)',
          'rgba(128, 255, 255, 0.6)'
        ],
        borderColor: [
          'rgba(64, 224, 255, 1)',
          'rgba(128, 255, 255, 1)',
          'rgba(64, 224, 255, 1)',
          'rgba(128, 255, 255, 1)'
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
          'rgba(107, 114, 128, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(245, 158, 66, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(107, 114, 128, 1)'
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
          color: '#ffffff'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
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
          color: '#ffffff',
          padding: 20
        }
      }
    }
  };

  const renderList = (arr) =>
    Array.isArray(arr) && arr.length > 0
      ? arr.map((item, idx) => (
          <li key={idx} className="lumina-list-item">{item}</li>
        ))
      : <li className="lumina-no-data">No data</li>;

  return (
    <div className="lumina-dashboard-container">
      {/* Floating background elements */}
      <div className="lumina-floating-elements">
        <div className="lumina-floating-element"></div>
        <div className="lumina-floating-element"></div>
        <div className="lumina-floating-element"></div>
      </div>

      {/* Header */}
      <div className="lumina-dashboard-header">
        <h1 className="lumina-dashboard-title">Supply Chain Dashboard</h1>
        <p className="lumina-dashboard-subtitle">Monitoreo en tiempo real de la cadena de suministro</p>
      </div>

      {/* KPIs */}
      <div className="lumina-kpi-grid">
        <div className="lumina-kpi-card">
          <div className="lumina-kpi-value">{showValue(dashboardData.total_suppliers)}</div>
          <div className="lumina-kpi-label">Total Suppliers</div>
        </div>
        <div className="lumina-kpi-card">
          <div className="lumina-kpi-value">{showValue(dashboardData.average_risk_score)}</div>
          <div className="lumina-kpi-label">Average Risk Score</div>
        </div>
        <div className="lumina-kpi-card">
          <div className="lumina-kpi-value">{showValue(dashboardData.on_time_delivery_percentage)}%</div>
          <div className="lumina-kpi-label">On-Time Delivery %</div>
        </div>
        <div className="lumina-kpi-card">
          <div className="lumina-kpi-value">{showValue(dashboardData.compliance_issues_count)}</div>
          <div className="lumina-kpi-label">Compliance Issues</div>
        </div>
        <div className="lumina-kpi-card">
          <div className="lumina-kpi-value">{showValue(dashboardData.high_risk_suppliers_count)}</div>
          <div className="lumina-kpi-label">High Risk Suppliers</div>
        </div>
        <div className="lumina-kpi-card">
          <div className="lumina-kpi-value">{showValue(dashboardData.average_delivery_delay_days)}</div>
          <div className="lumina-kpi-label">Avg. Delivery Delay (days)</div>
        </div>
        <div className="lumina-kpi-card">
          <div className="lumina-kpi-value">{showValue(dashboardData.financial_risk_score)}</div>
          <div className="lumina-kpi-label">Financial Risk Score</div>
        </div>
        <div className="lumina-kpi-card">
          <div className="lumina-kpi-value">{showValue(dashboardData.inventory_turnover_rate)}</div>
          <div className="lumina-kpi-label">Inventory Turnover Rate</div>
        </div>
      </div>

      {/* Additional KPIs Row */}
      <div className="lumina-kpi-grid lumina-additional-kpis">
        <div className="lumina-kpi-card">
          <div className="lumina-kpi-value">{showValue(dashboardData.supplier_dependency_index)}</div>
          <div className="lumina-kpi-label">Supplier Dependency Index</div>
        </div>
        <div className="lumina-kpi-card">
          <div className="lumina-kpi-value">{showValue(dashboardData.esg_non_compliance_count)}</div>
          <div className="lumina-kpi-label">ESG Non-Compliance</div>
        </div>
        <div className="lumina-kpi-card">
          <div className="lumina-kpi-value">{showValue(dashboardData.last_incident_date)}</div>
          <div className="lumina-kpi-label">Last Incident Date</div>
        </div>
      </div>

      {/* Supplier Region Distribution */}
      <div className="lumina-section">
        <h3 className="lumina-section-title">Distribución de Proveedores por Región</h3>
        <div className="lumina-chart-container">
          <Bar data={regionBarData} options={chartOptions} />
        </div>
        <div className="lumina-table-container">
          <table className="lumina-data-table">
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
      <div className="lumina-section">
        <h3 className="lumina-section-title">Distribución de Estado de Proveedores</h3>
        <div className="lumina-chart-container">
          <div className="lumina-pie-chart-wrapper">
            <div className="lumina-pie-chart-container">
              <Pie data={statusPieData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Risk Score Distribution Bar Chart */}
      <div className="lumina-section">
        <h3 className="lumina-section-title">Distribución de Puntuación de Riesgo</h3>
        <div className="lumina-chart-container">
          <Bar data={riskBarData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="lumina-section">
        <h3 className="lumina-section-title">Alertas Recientes</h3>
        <div className="lumina-list-container">
          <ul className="lumina-data-list">
            {renderList(dashboardData.recent_alerts)}
          </ul>
        </div>
      </div>

      {/* Critical Materials Shortage */}
      <div className="lumina-section">
        <h3 className="lumina-section-title">Escasez de Materiales Críticos</h3>
        <div className="lumina-list-container">
          <ul className="lumina-data-list">
            {renderList(dashboardData.critical_materials_shortage)}
          </ul>
        </div>
      </div>

      {/* Supply Chain Disruption Events */}
      <div className="lumina-section">
        <h3 className="lumina-section-title">Eventos de Disrupción en la Cadena de Suministro</h3>
        <div className="lumina-list-container">
          <ul className="lumina-data-list">
            {renderList(dashboardData.supply_chain_disruption_events)}
          </ul>
        </div>
      </div>

      {/* Suppliers Table */}
      {Array.isArray(dashboardData.suppliers) && dashboardData.suppliers.length > 0 && (
        <div className="lumina-section">
          <h3 className="lumina-section-title">Tabla de Proveedores</h3>
          <div className="lumina-table-container">
            <table className="lumina-data-table">
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

      <style jsx>{`
        .lumina-dashboard-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #0a1929 0%, #1e3a52 50%, #2d5a87 100%);
          min-height: 100vh;
          color: white;
          position: relative;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Floating background elements */
        .lumina-floating-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .lumina-floating-element {
          position: absolute;
          background: radial-gradient(circle, rgba(64, 224, 255, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          animation: lumina-float 8s ease-in-out infinite;
        }

        .lumina-floating-element:nth-child(1) {
          width: 300px;
          height: 300px;
          top: 5%;
          left: 75%;
          animation-delay: 0s;
        }

        .lumina-floating-element:nth-child(2) {
          width: 200px;
          height: 200px;
          top: 50%;
          left: 5%;
          animation-delay: 3s;
        }

        .lumina-floating-element:nth-child(3) {
          width: 150px;
          height: 150px;
          top: 20%;
          left: 30%;
          animation-delay: 6s;
        }

        @keyframes lumina-float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-30px) rotate(120deg) scale(1.1); }
          66% { transform: translateY(20px) rotate(240deg) scale(0.9); }
        }

        .lumina-dashboard-header {
          text-align: center;
          margin-bottom: 3rem;
          opacity: 0;
          animation: lumina-fadeInUp 1s ease forwards;
          position: relative;
          z-index: 1;
        }

        .lumina-dashboard-title {
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(135deg, #40e0ff 0%, #80ffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 30px rgba(64, 224, 255, 0.3);
        }

        .lumina-dashboard-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
        }

        @keyframes lumina-fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* KPI Cards */
        .lumina-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        .lumina-additional-kpis {
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .lumina-kpi-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
          opacity: 0;
          animation: lumina-slideInUp 0.8s ease forwards;
        }

        .lumina-kpi-card:nth-child(1) { animation-delay: 0.1s; }
        .lumina-kpi-card:nth-child(2) { animation-delay: 0.2s; }
        .lumina-kpi-card:nth-child(3) { animation-delay: 0.3s; }
        .lumina-kpi-card:nth-child(4) { animation-delay: 0.4s; }
        .lumina-kpi-card:nth-child(5) { animation-delay: 0.5s; }
        .lumina-kpi-card:nth-child(6) { animation-delay: 0.6s; }
        .lumina-kpi-card:nth-child(7) { animation-delay: 0.7s; }
        .lumina-kpi-card:nth-child(8) { animation-delay: 0.8s; }

        @keyframes lumina-slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .lumina-kpi-card:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.8s ease;
        }

        .lumina-kpi-card:hover:before {
          left: 100%;
        }

        .lumina-kpi-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 40px rgba(64, 224, 255, 0.2);
        }

        .lumina-kpi-value {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #40e0ff 0%, #80ffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lumina-kpi-label {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        /* Chart Sections */
        .lumina-section {
          margin-bottom: 3rem;
          opacity: 0;
          animation: lumina-fadeInUp 1s ease forwards;
          position: relative;
          z-index: 1;
        }

        .lumina-section:nth-child(4) { animation-delay: 0.2s; }
        .lumina-section:nth-child(5) { animation-delay: 0.4s; }
        .lumina-section:nth-child(6) { animation-delay: 0.6s; }

        .lumina-section-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #80ffff;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .lumina-chart-container {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          transition: all 0.3s ease;
        }

        .lumina-chart-container:hover {
          background: rgba(255, 255, 255, 0.12);
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }

        .lumina-pie-chart-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        .lumina-pie-chart-container {
          width: 300px;
          height: 300px;
        }

        /* Tables */
        .lumina-table-container {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.5rem;
          overflow-x: auto;
          margin-bottom: 2rem;
          transition: all 0.3s ease;
        }

        .lumina-table-container:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .lumina-data-table {
          width: 100%;
          border-collapse: collapse;
          color: white;
          font-size: 0.9rem;
        }

        .lumina-data-table th {
          background: rgba(64, 224, 255, 0.2);
          color: #80ffff;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid rgba(64, 224, 255, 0.3);
        }

        .lumina-data-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: background-color 0.2s ease;
        }

        .lumina-data-table tr:hover td {
          background: rgba(64, 224, 255, 0.1);
        }

        /* Lists */
        .lumina-list-container {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .lumina-data-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .lumina-list-item {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .lumina-list-item:hover {
          background: rgba(64, 224, 255, 0.1);
          transform: translateX(10px);
        }

        .lumina-list-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .lumina-no-data {
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
          text-align: center;
          padding: 2rem;
        }

        /* Loading and Error States */
        .lumina-loading-state {
          text-align: center;
          padding: 4rem;
          font-size: 1.2rem;
          color: #80ffff;
          position: relative;
          z-index: 1;
        }

        .lumina-loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(64, 224, 255, 0.3);
          border-top: 3px solid #40e0ff;
          border-radius: 50%;
          animation: lumina-spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes lumina-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .lumina-error-state {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          color: #ff6b6b;
          position: relative;
          z-index: 1;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .lumina-dashboard-container {
            padding: 1rem;
          }

          .lumina-dashboard-title {
            font-size: 2rem;
          }

          .lumina-kpi-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .lumina-kpi-card {
            padding: 1.5rem;
          }

          .lumina-kpi-value {
            font-size: 2.5rem;
          }

          .lumina-chart-container {
            padding: 1rem;
          }

          .lumina-section-title {
            font-size: 1.5rem;
          }

          .lumina-pie-chart-container {
            width: 250px;
            height: 250px;
          }

          .lumina-floating-element {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .lumina-dashboard-title {
            font-size: 1.5rem;
          }

          .lumina-kpi-value {
            font-size: 2rem;
          }

          .lumina-section-title {
            font-size: 1.2rem;
          }

          .lumina-data-table {
            font-size: 0.8rem;
          }

          .lumina-data-table th,
          .lumina-data-table td {
            padding: 0.5rem;
          }
        }

        /* Custom scrollbar */
        .lumina-dashboard-container::-webkit-scrollbar {
          width: 8px;
        }

        .lumina-dashboard-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .lumina-dashboard-container::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #40e0ff 0%, #80ffff 100%);
          border-radius: 4px;
        }

        .lumina-dashboard-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #80ffff 0%, #40e0ff 100%);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;