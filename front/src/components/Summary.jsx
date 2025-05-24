import React, { useRef, useState, useEffect } from 'react';
import { Map } from 'lucide-react';
import Dashboard from './Dashboard';
import Alerts from './Alerts';

const Summary = (props) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [alertsData, setAlertsData] = useState(null);

  // Sincroniza el dashboard global con el local al montar o cuando cambie
  useEffect(() => {
    if (!dashboardData && props.data) {
      setDashboardData(props.data);
    }
  }, [props.data]);

  // Sincroniza el global con el local
  useEffect(() => {
    if (!alertsData && props.alertsData) {
      setAlertsData(props.alertsData);
    }
  }, [props.alertsData]);

  // Subir documento
  const handleFileUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) return;
    setUploading(true);
    setUploadResult(null);
    setDashboardData(null);
    setAlertsData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/upload-document', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      setUploadResult(json);
    } catch (err) {
      setUploadResult({ success: false, error: 'Error uploading the file.' });
    }
    setUploading(false);
  };

  // Procesar documento con LLM y luego pedir dashboard y alerts
  const handleProcessAll = async () => {
    if (!uploadResult?.filename) return;
    setProcessing(true);
    setDashboardData(null);
    setAlertsData(null);

    const formData = new FormData();
    formData.append('filename', uploadResult.filename);

    try {
      // Procesa el documento con el LLM
      await fetch('http://127.0.0.1:8000/api/process-document', {
        method: 'POST',
        body: formData,
      });

      // Dashboard
      const resDashboard = await fetch(
        `http://127.0.0.1:8000/api/dashboard?filename=${encodeURIComponent(
          uploadResult.filename
        )}`
      );
      const dashboardJson = await resDashboard.json();
      setDashboardData(dashboardJson);
      if (props.setDashboardDataFromSummary) {
        props.setDashboardDataFromSummary(dashboardJson);
      }

      // Alerts
      const resAlerts = await fetch(
        `http://127.0.0.1:8000/api/alerts?filename=${encodeURIComponent(
          uploadResult.filename
        )}`
      );
      const alertsJson = await resAlerts.json();
      setAlertsData(alertsJson);
      if (props.setAlertsDataFromSummary) {
        props.setAlertsDataFromSummary(alertsJson);
      }

      // Aquí puedes agregar más fetch para otros componentes futuros
    } catch (err) {
      setDashboardData({ error: 'Error processing the document.' });
      setAlertsData({ error: 'Error processing alerts.' });
    }
    setProcessing(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Map className="text-blue-500 mr-2" size={28} />
        <h2 className="font-bold text-2xl text-gray-800">Summary</h2>
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="font-bold text-gray-700 mb-4">Upload a Document</h3>
        <form onSubmit={handleFileUpload} className="flex flex-col gap-4">
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.csv,.doc,.docx,.json,.txt"
            className="border rounded p-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
        {uploadResult && (
          <div className="mt-4">
            {uploadResult.success ? (
              <div className="text-green-600 font-semibold">
                {uploadResult.message}
              </div>
            ) : (
              <div className="text-red-500">{uploadResult.error}</div>
            )}
            {uploadResult.success && (
              <button
                onClick={handleProcessAll}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Generate Insights'}
              </button>
            )}
          </div>
        )}
        {dashboardData && (
          <div className="mt-6">
            <Dashboard data={dashboardData} loading={processing} />
          </div>
        )}
        {alertsData && (
          <div className="mt-6">
            <Alerts data={alertsData} loading={processing} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;