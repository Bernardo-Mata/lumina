import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ data, loading }) => {
  if (loading) return <div>Generating insights...</div>;
  if (!data) return <div>Press "Generating insights" to make a response.</div>;
  if (data.error) return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-red-500">{data.error}</div>
      <pre className="bg-white text-black p-2 rounded mt-2">{data.raw}</pre>
    </div>
  );

  // Preparar datos para la gráfica de barras
  const compliance = data.compliance_issues_count || {};
  const barData = {
    labels: Object.keys(compliance),
    datasets: [
      {
        label: 'Compliance Issues',
        data: Object.values(compliance),
        backgroundColor: ['#22c55e', '#ef4444', '#f59e42'],
      }
    ]
  };

  return (
    <div className="w-full p-6">
      <h2 className="font-bold text-2xl text-gray-800 mb-4">Compliance Issues (Bar Chart)</h2>
      <div className="bg-white rounded shadow p-4 mb-6">
        <Bar data={barData} />
      </div>
      <h3 className="font-bold text-lg text-gray-800 mt-8 mb-2">Compliance Issues (Table):</h3>
      <table className="min-w-max bg-white rounded shadow text-sm mb-6">
        <tbody>
          {Object.entries(compliance).map(([status, count]) => (
            <tr key={status}>
              <td className="px-4 py-2 border">{status}</td>
              <td className="px-4 py-2 border">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;