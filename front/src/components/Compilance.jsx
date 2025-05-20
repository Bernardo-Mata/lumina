import React from 'react';
import { CheckSquare } from 'lucide-react';

const Compilance = () => (
  <div className="p-6">
    {/* Título */}
    <div className="flex items-center mb-6">
      <CheckSquare className="text-blue-500 mr-2" size={28} />
      <h2 className="font-bold text-2xl text-gray-800">Compliance</h2>
    </div>

    {/* Contenido de cumplimiento */}
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold text-gray-700 mb-4">Compliance Overview</h3>
      <ul className="list-disc pl-6 text-gray-700">
        <li>All suppliers have submitted required documents.</li>
        <li>2 suppliers have expiring certifications this month.</li>
        <li>No major compliance issues detected.</li>
      </ul>
      <div className="mt-4 text-sm text-gray-500">
        Para más detalles, revisa la sección de documentos y auditorías.
      </div>
    </div>
  </div>
);

export default Compilance;