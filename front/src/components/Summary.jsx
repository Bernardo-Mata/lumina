import React, { useRef, useState, useEffect } from 'react';
import { Map } from 'lucide-react';
import Dashboard from './Dashboard';
import Alerts from './Alerts';
import Suppliers from './Suppliers';
import Compilance from './Compilance'; // Asegúrate de importar el componente de Compliance
import RiskScores from './RiskScores'; // Asegúrate de importar el componente de RiskScores

// Función para obtener N elementos aleatorios de un array
function getRandomItems(arr, n) {
  if (!Array.isArray(arr)) return [];
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

// Helper para obtener N claves random de un objeto
function getRandomKeys(obj, n) {
  if (!obj || typeof obj !== 'object') return [];
  const keys = Object.keys(obj);
  const shuffled = keys.sort(() => 0.5 - Math.random());
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
  const [complianceData, setComplianceData] = useState(null);
  const [riskScoresData, setRiskScoresData] = useState(null);

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

  useEffect(() => {
    if (!complianceData && props.complianceData) {
      setComplianceData(props.complianceData);
    }
  }, [props.complianceData]);

  useEffect(() => {
    if (!riskScoresData && props.riskScoresData) {
      setRiskScoresData(props.riskScoresData);
    }
  }, [props.riskScoresData]);

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

      // Compliance
      const resCompliance = await fetch(
        `http://127.0.0.1:8000/api/compliance?filename=${encodeURIComponent(uploadResult.filename)}`
      );
      const complianceJson = await resCompliance.json();
      setComplianceData(complianceJson);
      if (props.setComplianceDataFromSummary) {
        props.setComplianceDataFromSummary(complianceJson);
      }

      // Risk Scores
      const resRiskScores = await fetch(
        `http://127.0.0.1:8000/api/risk-scores?filename=${encodeURIComponent(uploadResult.filename)}`
      );
      const riskScoresJson = await resRiskScores.json();
      setRiskScoresData(riskScoresJson);
      if (props.setRiskScoresDataFromSummary) {
        props.setRiskScoresDataFromSummary(riskScoresJson);
      }
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

  // --- RESUMEN ALEATORIO PARA COMPLIANCE ---
  let complianceSummary = null;
  if (complianceData && Array.isArray(complianceData.summary)) {
    complianceSummary = getRandomItems(complianceData.summary, 3);
  }

  // --- RESUMEN ALEATORIO PARA RISK SCORES ---
  let riskScoresSummary = null;
  if (riskScoresData && Array.isArray(riskScoresData.risk_scores)) {
    riskScoresSummary = getRandomItems(riskScoresData.risk_scores, 10);
  }

  // --- RESUMEN ALEATORIO PARA DASHBOARD (4 insights random: tabla o gráfica) ---
  let dashboardVisuals = [];
  if (dashboardData && typeof dashboardData === 'object' && !dashboardData.error && !processing) {
    const possibleVisuals = [];

    // KPI Cards
    const kpis = [
      { key: 'total_suppliers', label: 'Total Suppliers', color: 'blue' },
      { key: 'average_risk_score', label: 'Average Risk Score', color: 'green' },
      { key: 'on_time_delivery_percentage', label: 'On-Time Delivery %', color: 'yellow' },
      { key: 'high_risk_suppliers_count', label: 'High Risk Suppliers', color: 'red' },
      { key: 'average_delivery_delay_days', label: 'Avg. Delivery Delay (days)', color: 'purple' },
      { key: 'financial_risk_score', label: 'Financial Risk Score', color: 'pink' },
      { key: 'inventory_turnover_rate', label: 'Inventory Turnover Rate', color: 'indigo' },
      { key: 'supplier_dependency_index', label: 'Supplier Dependency Index', color: 'orange' },
      { key: 'esg_non_compliance_count', label: 'ESG Non-Compliance', color: 'emerald' },
      { key: 'last_incident_date', label: 'Last Incident Date', color: 'gray' }
    ];
    kpis.forEach(kpi => {
      if (dashboardData[kpi.key] !== undefined && dashboardData[kpi.key] !== null) {
        possibleVisuals.push(() => (
          <div className={`bg-${kpi.color}-50 rounded shadow p-4 flex flex-col items-center`}>
            <span className={`text-2xl font-bold text-${kpi.color}-700`}>{dashboardData[kpi.key]}</span>
            <span className="text-gray-700 mt-2 text-center">{kpi.label}</span>
          </div>
        ));
      }
    });

    // Tabla: Supplier Region Distribution
    if (dashboardData.supplier_region_distribution && typeof dashboardData.supplier_region_distribution === 'object') {
      possibleVisuals.push(() => (
        <div className="bg-white rounded shadow p-4">
          <h4 className="font-bold text-gray-800 mb-2 text-center">Supplier Region Distribution</h4>
          <table className="min-w-max mx-auto text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Region</th>
                <th className="px-4 py-2 border">Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(dashboardData.supplier_region_distribution).map(([region, count]) => (
                <tr key={region}>
                  <td className="px-4 py-2 border">{region}</td>
                  <td className="px-4 py-2 border">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ));
    }

    // Tabla: Recent Alerts
    if (Array.isArray(dashboardData.recent_alerts) && dashboardData.recent_alerts.length > 0) {
      possibleVisuals.push(() => (
        <div className="bg-white rounded shadow p-4">
          <h4 className="font-bold text-gray-800 mb-2 text-center">Recent Alerts</h4>
          <ul className="text-sm divide-y">
            {dashboardData.recent_alerts.slice(0, 5).map((alert, idx) => (
              <li key={idx} className="py-1">{alert}</li>
            ))}
          </ul>
        </div>
      ));
    }

    // Tabla: Critical Materials Shortage
    if (Array.isArray(dashboardData.critical_materials_shortage) && dashboardData.critical_materials_shortage.length > 0) {
      possibleVisuals.push(() => (
        <div className="bg-white rounded shadow p-4">
          <h4 className="font-bold text-gray-800 mb-2 text-center">Critical Materials Shortage</h4>
          <ul className="text-sm divide-y">
            {dashboardData.critical_materials_shortage.slice(0, 5).map((item, idx) => (
              <li key={idx} className="py-1">{item}</li>
            ))}
          </ul>
        </div>
      ));
    }

    // Tabla: Supply Chain Disruption Events
    if (Array.isArray(dashboardData.supply_chain_disruption_events) && dashboardData.supply_chain_disruption_events.length > 0) {
      possibleVisuals.push(() => (
        <div className="bg-white rounded shadow p-4">
          <h4 className="font-bold text-gray-800 mb-2 text-center">Supply Chain Disruption Events</h4>
          <ul className="text-sm divide-y">
            {dashboardData.supply_chain_disruption_events.slice(0, 5).map((item, idx) => (
              <li key={idx} className="py-1">{item}</li>
            ))}
          </ul>
        </div>
      ));
    }

    // Tabla: Suppliers (solo 5 random)
    if (Array.isArray(dashboardData.suppliers) && dashboardData.suppliers.length > 0) {
      const randomSuppliers = getRandomItems(dashboardData.suppliers, 5);
      possibleVisuals.push(() => (
        <div className="bg-white rounded shadow p-4">
          <h4 className="font-bold text-gray-800 mb-2 text-center">Suppliers</h4>
          <table className="min-w-max mx-auto text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Risk Score</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {randomSuppliers.map((s, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 border">{s.name}</td>
                  <td className="px-4 py-2 border">{s.location}</td>
                  <td className="px-4 py-2 border">{s.risk_score}</td>
                  <td className="px-4 py-2 border">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ));
    }

    // Selecciona 4 visualizaciones random para mostrar arriba
    dashboardVisuals = getRandomItems(possibleVisuals, 4);
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
        {/* Mostrar 4 visualizaciones random del dashboard arriba */}
        {!processing && dashboardVisuals.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Dashboard Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardVisuals.map((Visual, idx) => (
                <Visual key={idx} />
              ))}
            </div>
          </div>
        )}
        {/* Mostrar todos los componentes como antes, excepto Dashboard */}
        {!processing && alertsSummary && (
          <div className="mt-8">
            <Alerts data={alertsSummary} loading={processing} />
          </div>
        )}
        {!processing && suppliersSummary && (
          <div className="mt-8">
            <Suppliers data={suppliersSummary} loading={processing} />
          </div>
        )}
        {!processing && complianceSummary && (
          <div className="mt-8">
            <Compilance data={{ summary: complianceSummary }} loading={processing} />
          </div>
        )}
        {!processing && riskScoresSummary && (
          <div className="mt-8">
            <RiskScores data={{ risk_scores: riskScoresSummary }} loading={processing} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;