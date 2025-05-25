import React, { useRef, useState, useEffect } from 'react';
import { Map } from 'lucide-react';
import Alerts from './Alerts';
import Suppliers from './Suppliers';
import Compilance from './Compilance';
import RiskScores from './RiskScores';
import ProductForm from './ProductForm';
import DataInputChoice from './DataInputChoice';
import Dashboard from './Dashboard';

// Helper para obtener N elementos aleatorios de un array
function getRandomItems(arr, n) {
  if (!Array.isArray(arr)) return [];
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const Summary = (props) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [inputMode, setInputMode] = useState(null);
  const [csvFilename, setCsvFilename] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  // Dashboard global para persistencia
  const [dashboardData, setDashboardData] = useState(() => {
    try {
      const stored = localStorage.getItem('dashboardData');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [randomDashboardKeys, setRandomDashboardKeys] = useState([]);

  // Alerts global para persistencia
  const [alertsData, setAlertsData] = useState(() => {
    // Usa el prop si existe, si no, intenta localStorage
    if (props.alertsData) return props.alertsData;
    try {
      const stored = localStorage.getItem('alertsData');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [randomAlerts, setRandomAlerts] = useState({
    high: [],
    medium: [],
    low: []
  });

  // Subir documento
  const handleFileUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/upload-document', {
        method: 'POST',
        body: formData,
      });
      setUploadStatus(res.status);
      const json = await res.json();
      setUploadResult(json);
      if (json.success) setCsvFilename(json.filename);
    } catch (err) {
      setUploadResult({ success: false, error: 'Error uploading the file.' });
    }
    setUploading(false);
  };

  // Cuando el formulario genera y sube el CSV
  const handleCsvCreated = (filename) => {
    setCsvFilename(filename);
    setUploadStatus(200);
    setInputMode(null); // Regresa al menú principal para poder presionar Generate Insights
  };

  // Lógica para el botón de "Generate Insights" (dashboard y alerts)
  const handleGenerateInsights = async () => {
    if (!csvFilename) return;
    setDashboardLoading(true);
    setAlertsLoading(true);
    setDashboardData(null);
    setAlertsData(null);
    try {
      // Dashboard
      const dashboardRes = await fetch(`http://127.0.0.1:8000/api/dashboard?filename=${encodeURIComponent(csvFilename)}`);
      const dashboardJson = await dashboardRes.json();
      setDashboardData(dashboardJson);
      localStorage.setItem('dashboardData', JSON.stringify(dashboardJson));
      const dashKeys = Object.keys(dashboardJson);
      setRandomDashboardKeys(getRandomItems(dashKeys, 4));

      // Alerts
      const alertsRes = await fetch(`http://127.0.0.1:8000/api/alerts?filename=${encodeURIComponent(csvFilename)}`);
      const alertsJson = await alertsRes.json();
      setAlertsData(alertsJson);
      localStorage.setItem('alertsData', JSON.stringify(alertsJson));
      if (props.setAlertsDataFromSummary) props.setAlertsDataFromSummary(alertsJson);

      // Seleccionar 2 random de cada riesgo
      const getByRisk = (risk) =>
        Array.isArray(alertsJson[risk]) ? getRandomItems(alertsJson[risk], 2) : [];
      setRandomAlerts({
        high: getByRisk('high_priority'),
        medium: getByRisk('medium_priority'),
        low: getByRisk('low_priority')
      });
    } catch (err) {
      setDashboardData({ error: 'Error generating dashboard insights.' });
      setAlertsData({ error: 'Error generating alerts insights.' });
      setRandomDashboardKeys([]);
      setRandomAlerts({ high: [], medium: [], low: [] });
    }
    setDashboardLoading(false);
    setAlertsLoading(false);
  };

  // Cuando cambias de sección (Summary), elige insights random nuevos
  useEffect(() => {
    if (!inputMode && dashboardData) {
      const dashKeys = Object.keys(dashboardData);
      setRandomDashboardKeys(getRandomItems(dashKeys, 4));
    }
    if (!inputMode && alertsData) {
      const getByRisk = (risk) =>
        Array.isArray(alertsData[risk]) ? getRandomItems(alertsData[risk], 2) : [];
      setRandomAlerts({
        high: getByRisk('high_priority'),
        medium: getByRisk('medium_priority'),
        low: getByRisk('low_priority')
      });
    }
  }, [inputMode, dashboardData, alertsData]);

  // Render principal
  if (!inputMode) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Map className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Summary</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <DataInputChoice
            onChoose={setInputMode}
            onGenerateInsights={handleGenerateInsights}
            uploadStatus={uploadStatus}
          />
        </div>
        {/* Mostrar solo 4 insights random del dashboard */}
        {dashboardData && randomDashboardKeys.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {randomDashboardKeys.map((key) => (
              <div key={key} className="bg-gray-100 rounded p-4 shadow">
                <div className="font-semibold text-gray-700">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                <div className="text-xl text-blue-700 font-bold mt-2">
                  {typeof dashboardData[key] === 'object'
                    ? JSON.stringify(dashboardData[key])
                    : String(dashboardData[key])}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Mostrar 2 random de cada riesgo de alerts */}
        {alertsData && (
          <div className="mt-8">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Alerts Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="font-semibold text-red-700 mb-1">High Risk</div>
                <ul className="bg-red-50 rounded p-2">
                  {randomAlerts.high.length > 0
                    ? randomAlerts.high.map((alert, idx) => (
                        <li key={idx} className="text-sm text-red-900 mb-1">{typeof alert === 'object' ? JSON.stringify(alert) : String(alert)}</li>
                      ))
                    : <li className="text-gray-500 text-sm">No high risk alerts</li>}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-yellow-700 mb-1">Medium Risk</div>
                <ul className="bg-yellow-50 rounded p-2">
                  {randomAlerts.medium.length > 0
                    ? randomAlerts.medium.map((alert, idx) => (
                        <li key={idx} className="text-sm text-yellow-900 mb-1">{typeof alert === 'object' ? JSON.stringify(alert) : String(alert)}</li>
                      ))
                    : <li className="text-gray-500 text-sm">No medium risk alerts</li>}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-green-700 mb-1">Low Risk</div>
                <ul className="bg-green-50 rounded p-2">
                  {randomAlerts.low.length > 0
                    ? randomAlerts.low.map((alert, idx) => (
                        <li key={idx} className="text-sm text-green-900 mb-1">{typeof alert === 'object' ? JSON.stringify(alert) : String(alert)}</li>
                      ))
                    : <li className="text-gray-500 text-sm">No low risk alerts</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (inputMode === 'upload') {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Map className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Summary</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700">Upload a Document</h3>
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => setInputMode(null)}
            >
              Back
            </button>
          </div>
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
            </div>
          )}
        </div>
      </div>
    );
  }

  if (inputMode === 'form') {
    return (
      <ProductForm
        onBack={() => setInputMode(null)}
        onCsvCreated={handleCsvCreated}
      />
    );
  }

  return null;
};

export default Summary;