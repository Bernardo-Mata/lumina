import React from 'react';
import { Server } from 'lucide-react';

const Suppliers = () => (
  <div className="p-6">
    {/* Título */}
    <div className="flex items-center mb-6">
      <Server className="text-blue-500 mr-2" size={28} />
      <h2 className="font-bold text-2xl text-gray-800">Suppliers</h2>
    </div>

    {/* Tabla de proveedores */}
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold text-gray-700 mb-4">Supplier List</h3>
      <div className="overflow-x-auto">
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
            <tr className="border-t">
              <td className="px-4 py-2">Supplier A</td>
              <td className="px-4 py-2">USA</td>
              <td className="px-4 py-2">80</td>
              <td className="px-4 py-2 text-green-600">Active</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Supplier B</td>
              <td className="px-4 py-2">China</td>
              <td className="px-4 py-2">65</td>
              <td className="px-4 py-2 text-green-600">Active</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Supplier C</td>
              <td className="px-4 py-2">Europe</td>
              <td className="px-4 py-2">40</td>
              <td className="px-4 py-2 text-red-600">Inactive</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Suppliers;