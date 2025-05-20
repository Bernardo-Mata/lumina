import React from 'react';
import { Shield } from 'lucide-react';

const RiskScores = () => (
  <div className="p-6">
    {/* Título */}
    <div className="flex items-center mb-6">
      <Shield className="text-blue-500 mr-2" size={28} />
      <h2 className="font-bold text-2xl text-gray-800">Risk Scores</h2>
    </div>

    {/* Tabla de puntajes de riesgo */}
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold text-gray-700 mb-4">Supplier Risk Scores</h3>
      <div className="overflow-x-auto">
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
            <tr className="border-t">
              <td className="px-4 py-2">Supplier A</td>
              <td className="px-4 py-2">Logistics</td>
              <td className="px-4 py-2">78</td>
              <td className="px-4 py-2 text-yellow-600">Medium</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Supplier B</td>
              <td className="px-4 py-2">Raw Materials</td>
              <td className="px-4 py-2">92</td>
              <td className="px-4 py-2 text-red-600">High</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Supplier C</td>
              <td className="px-4 py-2">Manufacturing</td>
              <td className="px-4 py-2">60</td>
              <td className="px-4 py-2 text-green-600">Low</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default RiskScores;