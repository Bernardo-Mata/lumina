import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

// Accept data and loading as props
const Reports = ({ data, loading }) => {
  const [report, setReport] = useState({});
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (data && typeof data === 'object' && !data.error) {
      setReport(data);
      setLocalLoading(false);
    } else if (data && data.error) {
      setReport({});
      setLocalLoading(false);
    } else if (!data) {
      // Fallback: fetch if no data prop (optional)
      fetch('http://127.0.0.1:8000/api/reports')
        .then(res => res.json())
        .then(json => {
          setReport(json);
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
        <Activity className="text-blue-500 mr-2" size={28} />
        <h2 className="font-bold text-2xl text-gray-800">Reports</h2>
      </div>
      {/* Reports Content */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-gray-700 mb-4">Analytics & Reports</h3>
        {isLoading ? (
          <div className="p-4">Loading reports...</div>
        ) : data && data.error ? (
          <div className="p-4 text-red-500">{data.error}</div>
        ) : (
          <ul className="list-disc pl-6 text-gray-700">
            <li>{report.monthly_risk_trend_analysis}</li>
            <li>{report.supplier_performance_summary}</li>
            <li>{report.compliance_audit_logs}</li>
            <li>{report.custom_exportable_reports}</li>
          </ul>
        )}
        <div className="mt-4 text-sm text-gray-500">
          Coming soon: integration with downloads and advanced visualizations.
        </div>
      </div>
    </div>
  );
};

export default Reports;