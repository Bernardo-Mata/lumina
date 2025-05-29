import React from 'react';

const priorityColors = {
  high_priority: 'border-red-500 bg-red-50',
  medium_priority: 'border-yellow-500 bg-yellow-50',
  low_priority: 'border-blue-500 bg-blue-50',
};

const Alerts = ({ data, loading }) => {
  if (loading) return <div className="p-6">Loading alerts...</div>;
  if (!data) return <div className="p-6 text-gray-500">No alerts data.</div>;
  if (data.error) return <div className="p-6 text-red-500">{data.error}</div>;

  const renderAlert = (alert, idx, level) => (
    <div
      key={idx}
      className={`border-l-4 ${priorityColors[level]} p-4 mb-3 rounded-lg shadow transition-transform hover:scale-[1.02]`}
    >
      <div className="flex items-center mb-2">
        <span className="font-bold text-lg text-gray-800 mr-4">
          {alert.sku || '-'}
        </span>
        <span className="px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide"
          style={{
            background: level === 'high_priority'
              ? '#ef4444'
              : level === 'medium_priority'
              ? '#f59e42'
              : '#3b82f6',
            color: '#fff',
            marginLeft: 'auto'
          }}
        >
          {level.replace('_', ' ')}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <span className="font-semibold text-gray-700">Type:</span>{' '}
          <span className="text-gray-800">{alert.product_type || '-'}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Availability:</span>{' '}
          <span className="text-gray-800">{alert.availability ?? alert.stock_levels ?? '-'}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Lead Time:</span>{' '}
          <span className="text-gray-800">{alert.lead_time ?? '-'}</span>
        </div>
      </div>
      <div className="text-gray-700 text-sm italic border-t pt-2 mb-2">
        {alert.description || '-'}
      </div>
      {alert.solutions && alert.solutions.length > 0 && (
        <div className="bg-green-100 border border-green-200 rounded p-2 mt-2">
          <span className="font-semibold text-green-700 block mb-1">Recommended Solutions:</span>
          <ul className="list-disc list-inside text-green-800 text-sm">
            {alert.solutions.map((sol, i) => (
              <li key={i}>{sol}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="font-bold text-2xl text-gray-800 mb-4">Detailed Alerts</h2>
      {data.problem_summary && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded text-yellow-800 shadow">
          <span className="font-semibold">Problem summary:</span> {data.problem_summary}
        </div>
      )}
      <div className="space-y-8">
        {['high_priority', 'medium_priority', 'low_priority'].map(level =>
          data[level] && data[level].length > 0 && (
            <div key={level}>
              <h3
                className={`font-bold text-lg mb-4 capitalize flex items-center ${
                  level === 'high_priority'
                    ? 'text-red-600'
                    : level === 'medium_priority'
                    ? 'text-yellow-600'
                    : 'text-blue-600'
                }`}
              >
                <span
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    level === 'high_priority'
                      ? 'bg-red-500'
                      : level === 'medium_priority'
                      ? 'bg-yellow-400'
                      : 'bg-blue-500'
                  }`}
                ></span>
                {level.replace('_', ' ')}
              </h3>
              <div>
                {data[level].map((alert, idx) => renderAlert(alert, idx, level))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Alerts;