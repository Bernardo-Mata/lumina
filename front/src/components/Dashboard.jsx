import React from 'react';

const Dashboard = ({ data, loading }) => {
  if (loading) return <div>Generando insights...</div>;
  if (!data) return <div>Presiona "Generar insights" para comenzar.</div>;
  if (data.error) return (
    <div>
      <div className="text-red-500">{data.error}</div>
      <pre className="bg-gray-100 p-2 rounded mt-2">{data.raw}</pre>
    </div>
  );

  // Mostrar el JSON crudo recibido
  return (
    <div className="p-6">
      <h2 className="font-bold text-2xl text-gray-800 mb-4">Respuesta del backend (JSON crudo):</h2>
      <pre className="bg-white text-black p-4 rounded text-xs overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default Dashboard;