import React from 'react';
import { Activity } from 'lucide-react';

const Reports = () => (
  <div className="p-6">
    {/* Título */}
    <div className="flex items-center mb-6">
      <Activity className="text-blue-500 mr-2" size={28} />
      <h2 className="font-bold text-2xl text-gray-800">Reports</h2>
    </div>

    {/* Contenido de reportes */}
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold text-gray-700 mb-4">Analytics & Reports</h3>
      <ul className="list-disc pl-6 text-gray-700">
        <li>Monthly risk trend analysis</li>
        <li>Supplier performance summary</li>
        <li>Compliance audit logs</li>
        <li>Custom exportable reports</li>
      </ul>
      <div className="mt-4 text-sm text-gray-500">
        Próximamente: integración con descargas y visualizaciones avanzadas.
      </div>
    </div>
  </div>
);

export default Reports;