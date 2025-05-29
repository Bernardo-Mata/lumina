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

// Helper para renderizar valores complejos de forma más amigable
const renderValue = (value) => {
  if (typeof value === 'undefined' || value === null) return '-';
  
  if (typeof value === 'object') {
    // Si es un array o un objeto, lo formateamos mejor
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside text-sm">
          {value.map((item, i) => (
            <li key={i}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    }
    
    // Si es un objeto con name, lo mostramos de forma especial
    if (value.name) {
      return (
        <div className="text-blue-700">
          {value.name} 
          {value.location ? <span className="text-gray-600"> ({value.location})</span> : ''}
          {value.risk_score ? <span className="text-red-600 ml-1">Risk: {value.risk_score}</span> : ''}
        </div>
      );
    }
    
    // Otros objetos, formateamos bonito
    return (
      <div className="text-sm bg-gray-50 p-1 rounded">
        {Object.entries(value).map(([key, val], i) => (
          <div key={i} className="flex">
            <span className="font-semibold mr-1">{key}:</span>
            <span>{renderValue(val)}</span>
          </div>
        ))}
      </div>
    );
  }
  
  // Para valores simples
  return String(value);
};

// Helper para renderizar una alerta individual de forma estructurada (similar a Alerts.jsx)
const renderAlert = (alert, level) => {
  if (typeof alert !== 'object') return String(alert);
  
  return (
    <div className={`p-2 rounded ${
      level === 'high' ? 'bg-red-100' : 
      level === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
    } mb-2`}>
      <div className="flex items-center mb-1">
        <span className="font-semibold text-sm">
          {alert.sku || '-'}
        </span>
        {alert.product_type && (
          <span className="text-xs ml-2 bg-gray-200 px-1 rounded">{alert.product_type}</span>
        )}
      </div>
      {alert.description && (
        <div className="text-xs italic">{alert.description}</div>
      )}
      {alert.solutions && alert.solutions.length > 0 && (
        <div className="text-xs mt-1">
          <span className="font-semibold">Suggested: </span>
          {alert.solutions[0]}
        </div>
      )}
    </div>
  );
};

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

  // Compliance global para persistencia
  const [complianceData, setComplianceData] = useState(() => {
    try {
      const stored = localStorage.getItem('complianceData');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [complianceLoading, setComplianceLoading] = useState(false);
  const [randomCompliance, setRandomCompliance] = useState([]);

  // Suppliers global para persistencia
  const [suppliersData, setSuppliersData] = useState(() => {
    try {
      const stored = localStorage.getItem('suppliersData');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [suppliersLoading, setSuppliersLoading] = useState(false);
  const [randomSuppliers, setRandomSuppliers] = useState([]);

  // RiskScores global para persistencia
  const [riskScoresData, setRiskScoresData] = useState(() => {
    try {
      const stored = localStorage.getItem('riskScoresData');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [riskScoresLoading, setRiskScoresLoading] = useState(false);
  const [randomRiskScores, setRandomRiskScores] = useState([]);

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

  // Lógica para el botón de "Generate Insights" (dashboard, alerts, compliance, suppliers, riskScores)
  const handleGenerateInsights = async () => {
    if (!csvFilename) return;
    setDashboardLoading(true);
    setAlertsLoading(true);
    setComplianceLoading(true);
    setSuppliersLoading(true);
    setRiskScoresLoading(true);
    setDashboardData(null);
    setAlertsData(null);
    setComplianceData(null);
    setSuppliersData(null);
    setRiskScoresData(null);
    try {
      // Dashboard
      const dashboardRes = await fetch(`http://127.0.0.1:8000/api/dashboard?filename=${encodeURIComponent(csvFilename)}`);
      const dashboardJson = await dashboardRes.json();
      setDashboardData(dashboardJson);
      localStorage.setItem('dashboardData', JSON.stringify(dashboardJson));
      if (props.setDashboardDataFromSummary) props.setDashboardDataFromSummary(dashboardJson);
      const dashKeys = Object.keys(dashboardJson);
      setRandomDashboardKeys(getRandomItems(dashKeys, 4));

      // Alerts
      const alertsRes = await fetch(`http://127.0.0.1:8000/api/alerts?filename=${encodeURIComponent(csvFilename)}`);
      const alertsJson = await alertsRes.json();
      setAlertsData(alertsJson);
      localStorage.setItem('alertsData', JSON.stringify(alertsJson));
      if (props.setAlertsDataFromSummary) props.setAlertsDataFromSummary(alertsJson);
      const getByRisk = (risk) =>
        Array.isArray(alertsJson[risk]) ? getRandomItems(alertsJson[risk], 2) : [];
      setRandomAlerts({
        high: getByRisk('high_priority'),
        medium: getByRisk('medium_priority'),
        low: getByRisk('low_priority')
      });

      // Compliance
      const complianceRes = await fetch(`http://127.0.0.1:8000/api/compliance?filename=${encodeURIComponent(csvFilename)}`);
      const complianceJson = await complianceRes.json();
      setComplianceData(complianceJson);
      localStorage.setItem('complianceData', JSON.stringify(complianceJson));
      if (props.setComplianceDataFromSummary) props.setComplianceDataFromSummary(complianceJson);
      setRandomCompliance(getRandomItems(complianceJson.summary, 3));

      // Suppliers
      const suppliersRes = await fetch(`http://127.0.0.1:8000/api/suppliers?filename=${encodeURIComponent(csvFilename)}`);
      const suppliersJson = await suppliersRes.json();
      setSuppliersData(suppliersJson);
      localStorage.setItem('suppliersData', JSON.stringify(suppliersJson));
      if (props.setSuppliersDataFromSummary) props.setSuppliersDataFromSummary(suppliersJson);
      setRandomSuppliers(getRandomItems(suppliersJson.suppliers, 3));

      // RiskScores
      const riskScoresRes = await fetch(`http://127.0.0.1:8000/api/risk-scores?filename=${encodeURIComponent(csvFilename)}`);
      const riskScoresJson = await riskScoresRes.json();
      setRiskScoresData(riskScoresJson);
      localStorage.setItem('riskScoresData', JSON.stringify(riskScoresJson));
      if (props.setRiskScoresDataFromSummary) props.setRiskScoresDataFromSummary(riskScoresJson);
      // riskScoresJson.scores debe ser un array
      setRandomRiskScores(getRandomItems(riskScoresJson.scores, 3));
    } catch (err) {
      setDashboardData({ error: 'Error generating dashboard insights.' });
      setAlertsData({ error: 'Error generating alerts insights.' });
      setComplianceData({ error: 'Error generating compliance insights.' });
      setSuppliersData({ error: 'Error generating suppliers insights.' });
      setRiskScoresData({ error: 'Error generating risk scores insights.' });
      setRandomDashboardKeys([]);
      setRandomAlerts({ high: [], medium: [], low: [] });
      setRandomCompliance([]);
      setRandomSuppliers([]);
      setRandomRiskScores([]);
    }
    setDashboardLoading(false);
    setAlertsLoading(false);
    setComplianceLoading(false);
    setSuppliersLoading(false);
    setRiskScoresLoading(false);
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
    if (!inputMode && complianceData && Array.isArray(complianceData.summary)) {
      setRandomCompliance(getRandomItems(complianceData.summary, 3));
    }
    if (!inputMode && suppliersData && Array.isArray(suppliersData.suppliers)) {
      setRandomSuppliers(getRandomItems(suppliersData.suppliers, 3));
    }
    if (!inputMode && riskScoresData && Array.isArray(riskScoresData.scores)) {
      setRandomRiskScores(getRandomItems(riskScoresData.scores, 3));
    }
  }, [inputMode, dashboardData, alertsData, complianceData, suppliersData, riskScoresData]);

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
                <div className="font-semibold text-gray-700">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <div className="mt-2">
                  {renderValue(dashboardData[key])}
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
                <div className="bg-red-50 rounded p-2">
                  {randomAlerts.high.length > 0
                    ? randomAlerts.high.map((alert, idx) => (
                        <div key={idx}>
                          {renderAlert(alert, 'high')}
                        </div>
                      ))
                    : <div className="text-gray-500 text-sm">No high risk alerts</div>}
                </div>
              </div>
              <div>
                <div className="font-semibold text-yellow-700 mb-1">Medium Risk</div>
                <div className="bg-yellow-50 rounded p-2">
                  {randomAlerts.medium.length > 0
                    ? randomAlerts.medium.map((alert, idx) => (
                        <div key={idx}>
                          {renderAlert(alert, 'medium')}
                        </div>
                      ))
                    : <div className="text-gray-500 text-sm">No medium risk alerts</div>}
                </div>
              </div>
              <div>
                <div className="font-semibold text-green-700 mb-1">Low Risk</div>
                <div className="bg-green-50 rounded p-2">
                  {randomAlerts.low.length > 0
                    ? randomAlerts.low.map((alert, idx) => (
                        <div key={idx}>
                          {renderAlert(alert, 'low')}
                        </div>
                      ))
                    : <div className="text-gray-500 text-sm">No low risk alerts</div>}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Mostrar 3 random de compliance */}
        {complianceData && randomCompliance.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Compliance Summary</h3>
            <ul className="bg-green-50 rounded p-4 space-y-2">
              {randomCompliance.map((item, idx) => (
                <li key={idx} className="text-green-900 font-semibold">{item}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Mostrar 3 random de suppliers */}
        {suppliersData && randomSuppliers.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Suppliers Summary</h3>
            <ul className="bg-blue-50 rounded p-4 space-y-2">
              {randomSuppliers.map((supplier, idx) => (
                <li key={idx} className="text-blue-900 font-semibold">
                  {renderValue(supplier)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Mostrar 3 random de risk scores */}
        {riskScoresData && randomRiskScores.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Risk Scores Summary</h3>
            <ul className="bg-purple-50 rounded p-4 space-y-2">
              {randomRiskScores.map((score, idx) => (
                <li key={idx} className="text-purple-900 font-semibold">
                  {renderValue(score)}
                </li>
              ))}
            </ul>
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