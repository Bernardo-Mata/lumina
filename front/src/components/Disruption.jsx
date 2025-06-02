import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Disruption = ({ message }) => {
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <AlertTriangle className="text-yellow-500 mr-2" size={28} />
        <h2 className="font-bold text-2xl text-gray-800">Disruption</h2>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="p-4 text-yellow-700 font-semibold">
          {message || 'No disruption information available.'}
        </div>
      </div>
    </div>
  );
};

export default Disruption;