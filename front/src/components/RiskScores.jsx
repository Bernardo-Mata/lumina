import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

// Accept data and loading as props
const RiskScores = ({ data, loading }) => {
  const [scores, setScores] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (data && Array.isArray(data.risk_scores)) {
      setScores(data.risk_scores);
      setLocalLoading(false);
    } else if (data && data.error) {
      setScores([]);
      setLocalLoading(false);
    } else if (!data) {
      // Fallback: fetch if no data prop (optional)
      fetch('http://127.0.0.1:8000/api/risk-scores')
        .then(res => res.json())
        .then(json => {
          setScores(Array.isArray(json.risk_scores) ? json.risk_scores : []);
          setLocalLoading(false);
        })
        .catch(() => setLocalLoading(false));
    }
  }, [data]);

  const isLoading = loading || localLoading;

  return (
    <div className="p-6">
      {/* Title */}
      <div className="flex items-center mb-6">
        <Shield className="text-blue-500 mr-2" size={28} />
        <h2 className="font-bold text-2xl text-gray-800">Risk Scores</h2>
      </div>
      {/* Risk Scores Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-gray-700 mb-4">Supplier Risk Scores</h3>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-4">Loading risk scores...</div>
          ) : data && data.error ? (
            <div className="p-4 text-red-500">{data.error}</div>
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