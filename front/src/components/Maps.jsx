import React from "react";
import { MapPin, Route, Package, Zap, Truck } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Ejemplo de rutas para la tabla de optimización
const routes = [
  {
    id: 1,
    from: "CDMX",
    to: "Guadalajara",
    mode: "Land",
    cost: 1200,
    time: "8h",
    risk: "low"
  },
  {
    id: 2,
    from: "CDMX",
    to: "Monterrey",
    mode: "Air",
    cost: 3500,
    time: "2h",
    risk: "medium"
  },
  {
    id: 3,
    from: "Veracruz",
    to: "CDMX",
    mode: "Sea",
    cost: 900,
    time: "16h",
    risk: "high"
  }
];

const Maps = () => {
  return (
    <>
      <style>{`
        .maps-section-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 1.2rem;
          text-align: center;
        }
        .maps-table th {
          background: #eff6ff;
          color: #2563eb;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #2563eb33;
        }
        .maps-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.2s;
        }
        .maps-table tr:hover td {
          background: #f1f5f9;
        }
      `}</style>
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-indigo-600" />
            Maps
          </h2>
        </div>
        {/* Aquí podrías agregar el mapa si lo necesitas */}
      </div>

      {/* Route Optimization Table implementado según tu código */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Route className="w-6 h-6 text-indigo-600" />
            Route Optimization
          </h2>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Route</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Mode</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cost</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Risk</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{route.from} to {route.to}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {route.mode === 'Sea' && <Package className="w-4 h-4 text-blue-600" />}
                        {route.mode === 'Air' && <Zap className="w-4 h-4 text-yellow-600" />}
                        {route.mode === 'Land' && <Truck className="w-4 h-4 text-green-600" />}
                        <span className="text-gray-900">{route.mode}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">${route.cost}</td>
                    <td className="py-3 px-4 text-gray-900">{route.time}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        route.risk === 'low' ? 'bg-green-100 text-green-800' :
                        route.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {route.risk}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                        Optimize
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Maps;