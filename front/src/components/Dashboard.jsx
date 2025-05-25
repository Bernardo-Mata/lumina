import React from 'react';
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
  
const Dashboard = ({ data, loading }) => {
  // NUEVO: Si no hay data, intenta cargar de localStorage
  let dashboardData = data;
  if (!dashboardData) {
    try {
      const stored = localStorage.getItem('dashboardData');
      if (stored) dashboardData = JSON.parse(stored);
    } catch {}
  }

  if (loading) return <div>Generating insights...</div>;
  if (!dashboardData) return <div>Press "Generating insights" to make a response.</div>;
  if (dashboardData.error) return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-red-500">{dashboardData.error}</div>
      <pre className="bg-white text-black p-2 rounded mt-2">{dashboardData.raw}</pre>
    </div>
  );

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
        backgroundColor: '#3b82f6',
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
        backgroundColor: ['#22c55e', '#ef4444', '#f59e42', '#3b82f6'],
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
        backgroundColor: '#ef4444',
      }
    ]
  };

  // Helper for lists
  const renderList = (arr) =>
    Array.isArray(arr) && arr.length > 0
      ? arr.map((item, idx) => (
          <li key={idx} className="border-b last:border-b-0 px-2 py-1">{item}</li>
        ))
      : <li className="text-gray-500 px-2 py-1">No data</li>;

  return (
    <div className="w-full p-6 space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded shadow p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-700">{showValue(dashboardData.total_suppliers)}</span>
          <span className="text-gray-700 mt-2">Total Suppliers</span>
        </div>
        <div className="bg-green-50 rounded shadow p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-green-700">{showValue(dashboardData.average_risk_score)}</span>
          <span className="text-gray-700 mt-2">Average Risk Score</span>
        </div>
        <div className="bg-yellow-50 rounded shadow p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-yellow-700">{showValue(dashboardData.on_time_delivery_percentage)}%</span>
          <span className="text-gray-700 mt-2">On-Time Delivery %</span>
        </div>
        <div className="bg-red-50 rounded shadow p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-red-700">{showValue(dashboardData.compliance_issues_count)}</span>
          <span className="text-gray-700 mt-2">Compliance Issues</span>
        </div>
      </div>

      {/* High Risk Suppliers & Financial Risk */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-red-100 rounded shadow p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-red-700">{showValue(dashboardData.high_risk_suppliers_count)}</span>
          <span className="text-gray-700 mt-2">High Risk Suppliers</span>
        </div>
        <div className="bg-purple-50 rounded shadow p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-purple-700">{showValue(dashboardData.average_delivery_delay_days)}</span>
          <span className="text-gray-700 mt-2">Avg. Delivery Delay (days)</span>
        </div>
        <div className="bg-pink-50 rounded shadow p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-pink-700">{showValue(dashboardData.financial_risk_score)}</span>
          <span className="text-gray-700 mt-2">Financial Risk Score</span>
        </div>
        <div className="bg-indigo-50 rounded shadow p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-indigo-700">{showValue(dashboardData.inventory_turnover_rate)}</span>
          <span className="text-gray-700 mt-2">Inventory Turnover Rate</span>
        </div>
      </div>

      {/* Supplier Dependency Index, ESG Non-Compliance, Last Incident */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-orange-50 rounded shadow p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-orange-700">{showValue(dashboardData.supplier_dependency_index)}</span>
          <span className="text-gray-700 mt-2">Supplier Dependency Index</span>
        </div>
        <div className="bg-emerald-50 rounded shadow p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-emerald-700">{showValue(dashboardData.esg_non_compliance_count)}</span>
          <span className="text-gray-700 mt-2">ESG Non-Compliance</span>
        </div>
        <div className="bg-gray-50 rounded shadow p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-gray-700">{showValue(dashboardData.last_incident_date)}</span>
          <span className="text-gray-700 mt-2">Last Incident Date</span>
        </div>
      </div>

      {/* Supplier Region Distribution (Bar Chart & Table) */}
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-2">Supplier Region Distribution</h3>
        <div className="bg-white rounded shadow p-4 mb-4">
          <Bar data={regionBarData} />
        </div>
        <table className="min-w-max bg-white rounded shadow text-sm mb-6">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Region</th>
              <th className="px-4 py-2 border">Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(regionDist).map(([region, count]) => (
              <tr key={region}>
                <td className="px-4 py-2 border">{region}</td>
                <td className="px-4 py-2 border">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NEW: Supplier Status Pie Chart */}
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-2">Supplier Status Distribution</h3>
        <div className="bg-white rounded shadow p-4 mb-6 flex justify-center">
          <div className="w-64">
            <Pie data={statusPieData} />
          </div>
        </div>
      </div>

      {/* NEW: Risk Score Distribution Bar Chart */}
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-2">Risk Score Distribution</h3>
        <div className="bg-white rounded shadow p-4 mb-6">
          <Bar data={riskBarData} />
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-2">Recent Alerts</h3>
        <ul className="bg-white rounded shadow text-sm mb-6 divide-y">
          {renderList(dashboardData.recent_alerts)}
        </ul>
      </div>

      {/* Critical Materials Shortage */}
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-2">Critical Materials Shortage</h3>
        <ul className="bg-white rounded shadow text-sm mb-6 divide-y">
          {renderList(dashboardData.critical_materials_shortage)}
        </ul>
      </div>

      {/* Supply Chain Disruption Events */}
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-2">Supply Chain Disruption Events</h3>
        <ul className="bg-white rounded shadow text-sm mb-6 divide-y">
          {renderList(dashboardData.supply_chain_disruption_events)}
        </ul>
      </div>

      {/* Suppliers Table */}
      {Array.isArray(dashboardData.suppliers) && dashboardData.suppliers.length > 0 && (
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">Suppliers Table</h3>
          <table className="min-w-max bg-white rounded shadow text-sm mb-6">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Risk Score</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.suppliers.map((s, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 border">{s.name}</td>
                  <td className="px-4 py-2 border">{s.location}</td>
                  <td className="px-4 py-2 border">{s.risk_score}</td>
                  <td className="px-4 py-2 border">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;