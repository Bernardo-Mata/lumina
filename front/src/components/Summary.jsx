import React from 'react';
import { Map } from 'lucide-react';

const Summary = ({ data, loading }) => {
  if (loading) return <div className="p-6 text-black bg-white">Loading summary...</div>;
  if (!data) return <div className="p-6 text-black bg-white">No summary data available.</div>;
  if (data.error) return (
    <div className="p-6">
      <div className="text-red-500">{data.error}</div>
      <pre className="bg-white text-black p-2 rounded mt-2">{data.raw}</pre>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Map className="text-blue-500 mr-2" size={28} />
        <h2 className="font-bold text-2xl text-gray-800">Summary</h2>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-gray-700 mb-4">Executive Summary</h3>
        <p className="text-gray-700">{data.summary || "No summary provided."}</p>
      </div>
    </div>
  );
};

export default Summary;