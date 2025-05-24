import React, { useEffect, useState } from 'react';
import { Server } from 'lucide-react';

// Accept data and loading as props
const Suppliers = ({ data, loading }) => {
  // If data is not passed as prop, fallback to fetching (for direct access)
  const [suppliers, setSuppliers] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setSuppliers(data);
      setLocalLoading(false);
    } else {
      // Fallback: fetch if no data prop (optional)
      fetch('http://127.0.0.1:8000/api/suppliers')
        .then(res => res.json())
        .then(data => {
          setSuppliers(data);
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
        <Server className="text-blue-500 mr-2" size={28} />
        <h2 className="font-bold text-2xl text-gray-800">Suppliers</h2>
      </div>
      {/* Supplier Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-gray-700 mb-4">Supplier List</h3>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-4">Loading suppliers...</div>
          ) : suppliers?.error ? (
            <div className="p-4 text-red-500">{suppliers.error}</div>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-gray-600">Name</th>
                  <th className="px-4 py-2 text-gray-600">Location</th>
                  <th className="px-4 py-2 text-gray-600">Risk Score</th>
                  <th className="px-4 py-2 text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(suppliers) && suppliers.map((supplier, idx) => (
                  <tr className="border-t" key={idx}>
                    <td className="px-4 py-2">{supplier.name}</td>
                    <td className="px-4 py-2">{supplier.location}</td>
                    <td className="px-4 py-2">{supplier.risk_score}</td>
                    <td className={`px-4 py-2 ${supplier.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                      {supplier.status}
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