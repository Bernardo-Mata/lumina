import React, { useRef, useState, useEffect } from 'react';
import { Map } from 'lucide-react';
import ProductForm from './ProductForm';
import DataInputChoice from './DataInputChoice';

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

  // Dashboard
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [randomDashboardKeys, setRandomDashboardKeys] = useState([]);

  // Alerts
  const [alertsData, setAlertsData] = useState(null);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [randomAlerts, setRandomAlerts] = useState({
    high: [],
    medium: [],
    low: []
  });

  // Compliance
  const [complianceData, setComplianceData] = useState(null);
  const [complianceLoading, setComplianceLoading] = useState(false);
  const [randomCompliance, setRandomCompliance] = useState([]);

  // Suppliers
  const [suppliersData, setSuppliersData] = useState(null);
  const [suppliersLoading, setSuppliersLoading] = useState(false);
  const [randomSuppliers, setRandomSuppliers] = useState([]);

  // Disruption
  const [disruptionData, setDisruptionData] = useState(null);
  const [disruptionLoading, setDisruptionLoading] = useState(false);

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
    setInputMode(null);
  };

  // Lógica para el botón de "Generate Insights"
  const handleGenerateInsights = async () => {
    if (!csvFilename) return;
    setDashboardLoading(true);
    setAlertsLoading(true);
    setComplianceLoading(true);
    setSuppliersLoading(true);
    setDisruptionLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Dashboard
      const dashboardRes = await fetch(
        `http://127.0.0.1:8000/api/dashboard?filename=${encodeURIComponent(csvFilename)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const dashboardJson = await dashboardRes.json();
      setDashboardData(dashboardJson);
      const dashKeys = Object.keys(dashboardJson);
      setRandomDashboardKeys(getRandomItems(dashKeys, 4));

      // Alerts
      const alertsRes = await fetch(
        `http://127.0.0.1:8000/api/alerts?filename=${encodeURIComponent(csvFilename)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const alertsJson = await alertsRes.json();
      setAlertsData(alertsJson);
      const getByRisk = (risk) =>
        Array.isArray(alertsJson[risk]) ? getRandomItems(alertsJson[risk], 2) : [];
      setRandomAlerts({
        high: getByRisk('high_priority'),
        medium: getByRisk('medium_priority'),
        low: getByRisk('low_priority')
      });

      // Compliance
      const complianceRes = await fetch(
        `http://127.0.0.1:8000/api/compliance?filename=${encodeURIComponent(csvFilename)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const complianceJson = await complianceRes.json();
      setComplianceData(complianceJson);
      setRandomCompliance(getRandomItems(complianceJson.summary, 3));

      // Suppliers
      const suppliersRes = await fetch(
        `http://127.0.0.1:8000/api/suppliers?filename=${encodeURIComponent(csvFilename)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const suppliersJson = await suppliersRes.json();
      setSuppliersData(suppliersJson);
      setRandomSuppliers(getRandomItems(suppliersJson.suppliers, 3));

      // Disruption
      const disruptionRes = await fetch(
        `http://127.0.0.1:8000/api/disruption?filename=${encodeURIComponent(csvFilename)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const disruptionJson = await disruptionRes.json();
      setDisruptionData(disruptionJson);

      // Guardar insights en backend (opcional)
      await guardarInsightEnBackend({
        dashboard: dashboardJson,
        alerts: alertsJson,
        suppliers: suppliersJson,
        compliance: complianceJson,
        disruption: disruptionJson,
      });

      await guardarInsightTabularEnBackend({
        dashboard: Array.isArray(dashboardJson) ? dashboardJson : [dashboardJson],
        alerts: Array.isArray(alertsJson) ? alertsJson : [alertsJson],
        suppliers: Array.isArray(suppliersJson) ? suppliersJson : [suppliersJson],
        compliance: Array.isArray(complianceJson) ? complianceJson : [complianceJson],
        disruption: Array.isArray(disruptionJson) ? disruptionJson : [disruptionJson],
      });

    } catch (err) {
      setDashboardData({ error: 'Error generating dashboard insights.' });
      setAlertsData({ error: 'Error generating alerts insights.' });
      setComplianceData({ error: 'Error generating compliance insights.' });
      setSuppliersData({ error: 'Error generating suppliers insights.' });
      setDisruptionData({ error: 'Error generating disruption insights.' });
      setRandomDashboardKeys([]);
      setRandomAlerts({ high: [], medium: [], low: [] });
      setRandomCompliance([]);
      setRandomSuppliers([]);
    }
    setDashboardLoading(false);
    setAlertsLoading(false);
    setComplianceLoading(false);
    setSuppliersLoading(false);
    setDisruptionLoading(false);
  };

  // Guardar insights en backend
  const guardarInsightEnBackend = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/guardar-insight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        console.log('Insight guardado:', result);
      } else {
        console.error('Error al guardar insight:', result);
      }
    } catch (err) {
      console.error('Error de red al guardar insight:', err);
    }
  };

  // Guardar insights tabulares en backend
  const guardarInsightTabularEnBackend = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/guardar-insight-tabular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        console.log('Datos tabulares guardados:', result);
      } else {
        console.error('Error al guardar datos tabulares:', result);
      }
    } catch (err) {
      console.error('Error de red al guardar datos tabulares:', err);
    }
  };

  // Render principal
  if (!inputMode) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-[#0a1929] via-[#1e3a52] to-[#2d5a87] relative">
        {/* Floating Orbs */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute rounded-full bg-cyan-300 opacity-10" style={{width:300, height:300, top:'10%', left:'-10%'}} />
          <div className="absolute rounded-full bg-cyan-300 opacity-10" style={{width:200, height:200, top:'60%', right:'-5%'}} />
          <div className="absolute rounded-full bg-cyan-300 opacity-10" style={{width:150, height:150, top:'30%', left:'50%'}} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <Map className="logo-glow text-cyan-400 mr-3 text-3xl" size={32} />
            <h2 className="font-bold text-3xl bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
              LUMINA Summary
            </h2>
          </div>
          <div className="glass bg-white/5 backdrop-blur-lg border border-cyan-200/20 rounded-2xl shadow p-8 mb-8">
            <DataInputChoice
              onChoose={setInputMode}
              onGenerateInsights={handleGenerateInsights}
              uploadStatus={uploadStatus}
            />
          </div>
          {/* Aquí puedes renderizar los datos de dashboard, alerts, compliance, suppliers, disruption como gustes */}
        </div>
        <style>{`
          .logo-glow {
            filter: drop-shadow(0 0 20px #40e0ff);
            animation: pulse-glow 2s ease-in-out infinite alternate;
          }
          @keyframes pulse-glow {
            from { filter: drop-shadow(0 0 20px #40e0ff); }
            to { filter: drop-shadow(0 0 30px #80ffff); }
          }
        `}</style>
      </div>
    );
  }

  if (inputMode === 'upload') {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-[#0a1929] via-[#1e3a52] to-[#2d5a87] relative">
        {/* Floating Orbs */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute rounded-full bg-cyan-300 opacity-10" style={{width:300, height:300, top:'10%', left:'-10%'}} />
          <div className="absolute rounded-full bg-cyan-300 opacity-10" style={{width:200, height:200, top:'60%', right:'-5%'}} />
          <div className="absolute rounded-full bg-cyan-300 opacity-10" style={{width:150, height:150, top:'30%', left:'50%'}} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <Map className="logo-glow text-cyan-400 mr-3 text-3xl" size={32} />
            <h2 className="font-bold text-3xl bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
              LUMINA Summary
            </h2>
          </div>
          <div className="glass bg-white/5 backdrop-blur-lg border border-cyan-200/20 rounded-2xl shadow p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Upload Document</h3>
              <button
                className="btn-secondary bg-white/10 border border-white/30 text-white rounded-lg px-6 py-2 hover:bg-white/20 hover:border-cyan-400 transition"
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
                className="form-input bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/50"
              />
              <button
                type="submit"
                className="btn-primary bg-gradient-to-r from-cyan-400 to-cyan-200 text-[#0a1929] font-bold rounded-lg px-6 py-3 shadow hover:shadow-cyan-200/30 transition"
                disabled={uploading}
              >
                {uploading ? (
                  <span>
                    <span className="loading-spinner inline-block mr-2"></span>
                    Uploading...
                  </span>
                ) : (
                  'Upload Document'
                )}
              </button>
            </form>
            {uploadResult && (
              <div className="mt-4">
                {uploadResult.success ? (
                  <div className="p-4 rounded-lg bg-green-900/30 border border-green-400/50 text-green-400 font-semibold">
                    {uploadResult.message}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-red-900/30 border border-red-400/50 text-red-400">
                    {uploadResult.error}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <style>{`
          .loading-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            display: inline-block;
            vertical-align: middle;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (inputMode === 'form') {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-[#0a1929] via-[#1e3a52] to-[#2d5a87] relative">
        {/* Floating Orbs */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute rounded-full bg-cyan-300 opacity-10" style={{width:300, height:300, top:'10%', left:'-10%'}} />
          <div className="absolute rounded-full bg-cyan-300 opacity-10" style={{width:200, height:200, top:'60%', right:'-5%'}} />
          <div className="absolute rounded-full bg-cyan-300 opacity-10" style={{width:150, height:150, top:'30%', left:'50%'}} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <Map className="logo-glow text-cyan-400 mr-3 text-3xl" size={32} />
            <h2 className="font-bold text-3xl bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
              LUMINA Summary
            </h2>
          </div>
          <div className="glass bg-white/5 backdrop-blur-lg border border-cyan-200/20 rounded-2xl shadow p-8 mb-8">
            <ProductForm
              onBack={() => setInputMode(null)}
              onCsvCreated={handleCsvCreated}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const UserInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/insights", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (res.ok) {
          const data = await res.json();
          setInsights(data);
        } else {
          setInsights([]);
        }
      } catch (err) {
        setInsights([]);
      }
      setLoading(false);
    };
    fetchInsights();
  }, []);

  if (loading) return <div>Cargando insights...</div>;
  if (!insights.length) return <div>No hay insights para este usuario.</div>;

  return (
    <div className="lumina-insights-table">
      <h2>Mis Insights</h2>
      <table>
        <thead>
          <tr>
            <th>Archivo</th>
            <th>Fecha</th>
            <th>Dashboard</th>
            <th>Alerts</th>
            <th>Suppliers</th>
            <th>Compliance</th>
            <th>Risk Scores</th>
            <th>Disruption</th>
          </tr>
        </thead>
        <tbody>
          {insights.map((insight) => (
            <tr key={insight.id}>
              <td>{insight.filename || insight.csv_filename}</td>
              <td>{insight.created_at ? new Date(insight.created_at).toLocaleString() : ""}</td>
              <td>
                <pre style={{ maxWidth: 200, whiteSpace: "pre-wrap" }}>
                  {insight.dashboard_json}
                </pre>
              </td>
              <td>
                <pre style={{ maxWidth: 200, whiteSpace: "pre-wrap" }}>
                  {insight.alerts_json}
                </pre>
              </td>
              <td>
                <pre style={{ maxWidth: 200, whiteSpace: "pre-wrap" }}>
                  {insight.suppliers_json}
                </pre>
              </td>
              <td>
                <pre style={{ maxWidth: 200, whiteSpace: "pre-wrap" }}>
                  {insight.compliance_json}
                </pre>
              </td>
              <td>
                <pre style={{ maxWidth: 200, whiteSpace: "pre-wrap" }}>
                  {insight.risk_scores_json}
                </pre>
              </td>
              <td>
                <pre style={{ maxWidth: 200, whiteSpace: "pre-wrap" }}>
                  {insight.disruption_json}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .lumina-insights-table table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(255,255,255,0.03);
          color: #fff;
        }
        .lumina-insights-table th, .lumina-insights-table td {
          border: 1px solid #40e0ff33;
          padding: 8px;
          text-align: left;
        }
        .lumina-insights-table th {
          background: #0a1929;
        }
        .lumina-insights-table tr:nth-child(even) {
          background: #1e3a52;
        }
      `}</style>
    </div>
  );
};

export default Summary;