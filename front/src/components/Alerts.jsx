import React from 'react';
import { List, AlertTriangle, AlertCircle } from 'lucide-react';

const Alerts = () => (
  <div className="p-6">
    {/* Título */}
    <div className="flex items-center mb-6">
      <List className="text-blue-500 mr-2" size={28} />
      <h2 className="font-bold text-2xl text-gray-800">Alerts</h2>
    </div>

    {/* Lista de alertas */}
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold text-gray-700 mb-4">Active Alerts</h3>
      <ul className="divide-y">
        <li className="flex p-4 hover:bg-gray-50">
          <div className="flex-shrink-0 mr-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle size={18} className="text-yellow-500" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800">Supplier Delay Detected</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Supplier X</span>
              <span>10m ago</span>
            </div>
          </div>
        </li>
        <li className="flex p-4 hover:bg-gray-50">
          <div className="flex-shrink-0 mr-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle size={18} className="text-red-500" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800">Compliance Issue</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Document Expired</span>
              <span>1h ago</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
);

export default Alerts;