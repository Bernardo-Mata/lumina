import React, { useEffect, useState } from 'react';
import { Server } from 'lucide-react';

// Helper para formatear el risk score como porcentaje
const formatRiskScore = (score) => {
  if (typeof score !== 'number') return '-';
  return `${(score).toFixed(2)}%`;
};

const riskColor = (score) => {
  if (typeof score !== 'number') return '';
  if (score >= 80) return 'bg-red-100 text-red-700 border-red-300';
  if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  return 'bg-green-100 text-green-700 border-green-300';
};

const statusColor = (status) => {
  if (!status) return '';
  return status.toLowerCase() === 'active'
    ? 'bg-green-200 text-green-800 border-green-400'
    : 'bg-red-200 text-red-800 border-red-400';
};

// Este componente ahora se encarga de hacer fetch al endpoint de suppliers
const Suppliers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cambia la URL al endpoint real de tu backend que devuelve los suppliers en JSON
    fetch('http://127.0.0.1:8000/suppliers')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError('Error loading suppliers');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Server className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Suppliers</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="p-4">Loading suppliers...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Server className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Suppliers</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="p-4 text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  const suppliers = Array.isArray(data) ? data : [];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Server className="text-blue-500 mr-2" size={28} />
        <h2 className="font-bold text-2xl text-gray-800">Suppliers</h2>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-gray-700 mb-4">Supplier List</h3>
        <div className="overflow-x-auto">
          {suppliers.length === 0 ? (
            <div className="p-4 text-gray-500">No suppliers available.</div>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-4 py-2 text-blue-700 font-semibold rounded-tl">Name</th>
                  <th className="px-4 py-2 text-blue-700 font-semibold">Location</th>
                  <th className="px-4 py-2 text-blue-700 font-semibold">Risk Score</th>
                  <th className="px-4 py-2 text-blue-700 font-semibold rounded-tr">Status</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier, idx) => (
                  <tr
                    className={`border-t hover:bg-blue-50 transition ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-blue-100'
                    }`}
                    key={idx}
                  >
                    <td className="px-4 py-2 font-medium text-gray-800">{supplier.name}</td>
                    <td className="px-4 py-2 text-gray-700">{supplier.location}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded border text-xs font-semibold ${riskColor(supplier.risk_score)}`}
                      >
                        {formatRiskScore(supplier.risk_score)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded border text-xs font-semibold ${statusColor(supplier.status)}`}
                      >
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
  );
};

export default Suppliers;