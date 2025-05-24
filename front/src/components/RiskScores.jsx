import React from 'react';
import { Shield } from 'lucide-react';

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

  const scores = Array.isArray(data?.risk_scores) ? data.risk_scores : [];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Shield className="text-blue-500 mr-2" size={28} />
        <h2 className="font-bold text-2xl text-gray-800">Risk Scores</h2>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-gray-700 mb-4">Supplier Risk Scores</h3>
        <div className="overflow-x-auto">
          {scores.length === 0 ? (
            <div className="p-4 text-gray-500">No risk scores available.</div>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-gray-600">Supplier</th>
                  <th className="px-4 py-2 text-gray-600">Category</th>
                  <th className="px-4 py-2 text-gray-600">Risk Score</th>
                  <th className="px-4 py-2 text-gray-600">Level</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((row, idx) => (
                  <tr className="border-t" key={idx}>
                    <td className="px-4 py-2">{row.supplier}</td>
                    <td className="px-4 py-2">{row.category}</td>
                    <td className="px-4 py-2">{row.risk_score}</td>
                    <td className={`px-4 py-2 ${
                      row.level === 'High'
                        ? 'text-red-600'
                        : row.level === 'Medium'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}>
                      {row.level}
                    </td>
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