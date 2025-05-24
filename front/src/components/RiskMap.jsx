import React from 'react';
import { Map } from 'lucide-react';

const RiskMap = () => (
  <div className="p-6">
    {/* Título */}
    <div className="flex items-center mb-6">
      <Map className="text-blue-500 mr-2" size={28} />
      <h2 className="font-bold text-2xl text-gray-800">Risk Map</h2>
    </div>

    {/* Mapa de riesgos (placeholder visual) */}
    <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-40 h-40 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <Map className="text-blue-400" size={64} />
      </div>
      <p className="text-gray-600 text-center">
        Aquí se mostrará un mapa interactivo de riesgos de la cadena de suministro.<br />
        (Integración de mapa pendiente)
      </p>
    </div>
  </div>
);

export default RiskMap;