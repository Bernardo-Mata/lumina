import React from 'react';
import { Server } from 'lucide-react';

// Recibe data y loading como props
const Suppliers = ({ data, loading }) => {
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

  if (data && data.error) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Server className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Suppliers</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="p-4 text-red-500">{data.error}</div>
          <pre className="bg-white text-black p-2 rounded mt-2">{data.raw}</pre>
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
                <tr>
                  <th className="px-4 py-2 text-gray-600">Name</th>
                  <th className="px-4 py-2 text-gray-600">Location</th>
                  <th className="px-4 py-2 text-gray-600">Risk Score</th>
                  <th className="px-4 py-2 text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier, idx) => (
                  <tr className="border-t" key={idx}>
                    <td className="px-4 py-2 text-gray-500">{supplier.name}</td>
                    <td className="px-4 py-2 text-gray-500">{supplier.location}</td>
                    <td className="px-4 py-2 text-gray-500">{supplier.risk_score}</td>
                    <td className={`px-4 py-2 text-gray-500 ${supplier.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
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