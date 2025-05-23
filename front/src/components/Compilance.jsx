import React, { useEffect, useState } from 'react';
import { CheckSquare } from 'lucide-react';

// Accept data and loading as props
const Compilance = ({ data, loading }) => {
  const [summary, setSummary] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (data && Array.isArray(data.summary)) {
      setSummary(data.summary);
      setLocalLoading(false);
    } else if (data && data.error) {
      setSummary([]);
      setLocalLoading(false);
    } else if (!data) {
      // Fallback: fetch if no data prop (optional)
      fetch('http://127.0.0.1:8000/api/compliance')
        .then(res => res.json())
        .then(json => {
          setSummary(Array.isArray(json.summary) ? json.summary : []);
          setLocalLoading(false);
        })
        .catch(() => setLocalLoading(false));
    }
  }, [data]);

  const isLoading = loading || localLoading;

  return (
    <div className="p-6">
      {/* Title */}
      <div className="flex items-center mb-6">
        <CheckSquare className="text-blue-500 mr-2" size={28} />
        <h2 className="font-bold text-2xl text-gray-800">Compliance</h2>
      </div>
      {/* Compliance Content */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-gray-700 mb-4">Compliance Overview</h3>
        {isLoading ? (
          <div className="p-4">Loading compliance summary...</div>
        ) : data && data.error ? (
          <div className="p-4 text-red-500">{data.error}</div>
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