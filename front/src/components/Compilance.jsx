import React from 'react';
import { CheckSquare } from 'lucide-react';

// Recibe data y loading como props
const Compilance = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <CheckSquare className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Compliance</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="p-4">Loading compliance summary...</div>
        </div>
      </div>
    );
  }

  if (data && data.error) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <CheckSquare className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Compliance</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="p-4 text-red-500">{data.error}</div>
          <pre className="bg-white text-black p-2 rounded mt-2">{data.raw}</pre>
        </div>
      </div>
    );
  }

  // Mostrar el resumen si existe
  const summary = data && Array.isArray(data.summary) ? data.summary : [];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <CheckSquare className="text-blue-500 mr-2" size={28} />
        <h2 className="font-bold text-2xl text-gray-800">Compliance</h2>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-gray-700 mb-4">Compliance Overview</h3>
        {summary.length === 0 ? (
          <div className="p-4 text-gray-500">No compliance summary available.</div>
        ) : (
          <ul className="list-disc pl-6 text-gray-700">
            {summary.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
        <div className="mt-4 text-sm text-gray-500">
          For more details, check the documents and audits section.
        </div>
      </div>
    </div>
  );
};

export default Compilance;