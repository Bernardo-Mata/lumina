import React, { useRef, useState, useEffect } from 'react';
import { Map } from 'lucide-react';
import Dashboard from './Dashboard';
import Alerts from './Alerts';
import Suppliers from './Suppliers';

// Función para obtener N elementos aleatorios de un array
function getRandomItems(arr, n) {
  if (!Array.isArray(arr)) return [];
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const Summary = (props) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [alertsData, setAlertsData] = useState(null);
  const [suppliersData, setSuppliersData] = useState(null);

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

  useEffect(() => {
    if (!suppliersData && props.suppliersData) {
      setSuppliersData(props.suppliersData);
    }
  }, [props.suppliersData]);

  // Subir documento
  const handleFileUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) return;
    setUploading(true);
    setUploadResult(null);
    setDashboardData(null);
    setAlertsData(null);
    setSuppliersData(null);

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
    setSuppliersData(null);

    const formData = new FormData();
    formData.append('filename', uploadResult.filename);

    try {
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

      // Suppliers
      const resSuppliers = await fetch(
        `http://127.0.0.1:8000/api/suppliers?filename=${encodeURIComponent(
          uploadResult.filename
        )}`
      );
      const suppliersJson = await resSuppliers.json();
      setSuppliersData(suppliersJson);
      if (props.setSuppliersDataFromSummary) {
        props.setSuppliersDataFromSummary(suppliersJson);
      }

      // Aquí puedes agregar más fetch para otros componentes futuros
    } catch (err) {
      setDashboardData({ error: 'Error processing the document.' });
      setAlertsData({ error: 'Error processing alerts.' });
    }
    setProcessing(false);
  };

  // --- RESUMEN ALEATORIO PARA ALERTS ---
  let alertsSummary = null;
  if (alertsData) {
    alertsSummary = {};
    ['high_priority', 'medium_priority', 'low_priority'].forEach((level) => {
      if (Array.isArray(alertsData[level])) {
        alertsSummary[level] = getRandomItems(alertsData[level], 5);
      }
    });
    // Mantén el problem_summary si existe
    if (alertsData.problem_summary) {
      alertsSummary.problem_summary = alertsData.problem_summary;
    }
  }

  // --- RESUMEN ALEATORIO PARA SUPPLIERS ---
  let suppliersSummary = null;
  if (Array.isArray(suppliersData)) {
    suppliersSummary = getRandomItems(suppliersData, 10);
  }

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
        {alertsSummary && (
          <div className="mt-6">
            <Alerts data={alertsSummary} loading={processing} />
          </div>
        )}
        {suppliersSummary && (
          <div className="mt-6">
            <Suppliers data={suppliersSummary} loading={processing} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;