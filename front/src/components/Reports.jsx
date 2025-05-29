import React from 'react';
import { Activity } from 'lucide-react';

// Recibe data y loading como props
const Reports = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Activity className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Reports</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="p-4">Loading reports...</div>
        </div>
      </div>
    );
  }

  if (data && data.error) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Activity className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Reports</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="p-4 text-red-500">{data.error}</div>
          <pre className="bg-white text-black p-2 rounded mt-2">{data.raw}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Activity className="text-blue-500 mr-2" size={28} />
        <h2 className="font-bold text-2xl text-gray-800">Reports</h2>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-gray-700 mb-4">Analytics & Reports</h3>
        <ul className="list-disc pl-6 text-gray-700">
          <li>{data?.monthly_risk_trend_analysis}</li>
          <li>{data?.supplier_performance_summary}</li>
          <li>{data?.compliance_audit_logs}</li>
          <li>{data?.custom_exportable_reports}</li>
        </ul>
        <div className="mt-4 text-sm text-gray-500">
          Coming soon: integration with downloads and advanced visualizations.
        </div>
      </div>
    </div>
  );
};

export default Reports;