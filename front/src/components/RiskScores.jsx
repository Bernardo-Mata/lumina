import React from 'react';
import { Shield } from 'lucide-react';

// Helper para formatear el risk score y color
const getRiskColor = (score) => {
  if (typeof score !== 'number') return 'bg-gray-200 text-gray-700 border-gray-300';
  if (score >= 80) return 'bg-red-100 text-red-700 border-red-300';
  if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  return 'bg-green-100 text-green-700 border-green-300';
};

// Recibe data y loading como props
const RiskScores = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Shield className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Risk Scores</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="p-4">Loading risk scores...</div>
        </div>
      </div>
    );
  }

  if (data && data.error) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Shield className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Risk Scores</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="p-4 text-red-500">{data.error}</div>
          <pre className="bg-white text-black p-2 rounded mt-2">{data.raw}</pre>
        </div>
      </div>
    );
  }

  // Cambia aquí: suppliers en vez de risk_scores
  const suppliers = data && Array.isArray(data.suppliers) ? data.suppliers : [];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Shield className="text-blue-500 mr-2" size={28} />
        <h2 className="font-bold text-2xl text-gray-800">Supplier Risk Scores</h2>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-gray-700 mb-4">Suppliers</h3>
        <div className="overflow-x-auto">
          {suppliers.length === 0 ? (
            <div className="p-4 text-gray-500">No supplier risk data available.</div>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-4 py-2 text-blue-700 font-semibold rounded-tl">Name</th>
                  <th className="px-4 py-2 text-blue-700 font-semibold">Location</th>
                  <th className="px-4 py-2 text-blue-700 font-semibold">Risk Score</th>
                  <th className="px-4 py-2 text-blue-700 font-semibold">Reason</th>
                  <th className="px-4 py-2 text-blue-700 font-semibold rounded-tr">Status</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((item, idx) => (
                  <tr
                    className={`border-t hover:bg-blue-50 transition ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-blue-100'
                    }`}
                    key={idx}
                  >
                    <td className="px-4 py-2 font-medium text-gray-800">{item.name}</td>
                    <td className="px-4 py-2">{item.location}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded border text-xs font-semibold ${getRiskColor(item.risk_score)}`}
                      >
                        {typeof item.risk_score === 'number'
                          ? `${item.risk_score.toFixed(2)}%`
                          : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-700">{item.reason || '-'}</td>
                    <td className="px-4 py-2">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskScores;