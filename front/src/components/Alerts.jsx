import React, { useEffect, useState } from 'react';
import { List, AlertTriangle, AlertCircle } from 'lucide-react';

const PRIORITY_CONFIG = [
  { key: 'high_priority', label: 'High (Red)', icon: <AlertCircle className="text-red-500" />, color: 'border-red-500' },
  { key: 'medium_priority', label: 'Medium (Yellow)', icon: <AlertTriangle className="text-yellow-500" />, color: 'border-yellow-500' },
  { key: 'low_priority', label: 'Low (Green)', icon: <AlertTriangle className="text-green-500" />, color: 'border-green-500' },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/alerts-summary')
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading alerts...</div>;
  if (!alerts || alerts.error) return <div className="p-6 text-red-500">Error to import the alerts.</div>;

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <List className="text-blue-500 mr-2" size={28} />
        <h2 className="font-bold text-2xl text-gray-800">Alerts</h2>
      </div>
      {PRIORITY_CONFIG.map(({ key, label, icon, color }) => (
        <div key={key} className="mb-6">
          <h3 className={`font-bold mb-2 flex items-center ${color}`}>
            {icon}
            <span className="ml-2">{label}</span>
          </h3>
          <ul className="divide-y">
            {(alerts[key] || []).length === 0 && (
              <li className="text-gray-500 text-sm px-2 py-2">No alerts in this risk</li>
            )}
            {(alerts[key] || []).map((alert, idx) => (
              <li key={idx} className="flex flex-col p-4 hover:bg-gray-50 border-l-4 mb-2 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{alert.type}</span>
                  <span className="text-xs text-gray-500">{alert.timestamp}</span>
                </div>
                <div className="text-gray-600 text-sm">{alert.description}</div>
                <div className="text-xs text-gray-400 mt-1">{alert.location}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Alerts;