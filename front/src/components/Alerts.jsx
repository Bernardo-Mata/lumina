import React, { useEffect, useState } from 'react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user_alerts", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (res.ok) {
          let data = await res.json();
          if (typeof data === "string") {
            try {
              data = JSON.parse(data);
            } catch (e) {
              data = [];
            }
          }
          if (data && data.alerts) {
            setAlerts(data.alerts);
          } else {
            setAlerts(data);
          }
        } else {
          setAlerts([]);
        }
      } catch (err) {
        setAlerts([]);
      }
      setLoading(false);
    };
    fetchAlerts();
  }, []);

  // Agrupa alertas por prioridad
  const groupedAlerts = {
    High: [],
    Medium: [],
    Low: [],
  };
  alerts.forEach(alert => {
    if (alert.priority === "High") groupedAlerts.High.push(alert);
    else if (alert.priority === "Medium") groupedAlerts.Medium.push(alert);
    else groupedAlerts.Low.push(alert);
  });

  const renderAlert = (alert, idx, priority) => (
    <div
      key={idx}
      className={`
        bg-white rounded-lg shadow-sm border p-6 mb-6 transition-colors
        ${priority === "High" ? "border-red-200" : priority === "Medium" ? "border-yellow-200" : "border-green-200"}
        hover:bg-gray-50
      `}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <span className="text-lg font-bold text-gray-900">{alert.sku || '-'}</span>
        <span className={`
          px-2 py-1 rounded-full text-xs font-medium uppercase shadow
          ${priority === "High"
            ? "bg-red-100 text-red-800"
            : priority === "Medium"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800"}
        `}>
          {priority === "High"
            ? "Alta Prioridad"
            : priority === "Medium"
            ? "Prioridad Media"
            : "Prioridad Baja"}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <span className="font-medium text-gray-600">Tipo: </span>
          <span className="text-gray-900">{alert.product_type || '-'}</span>
        </div>
        <div>
          <span className="font-medium text-gray-600">Disponibilidad: </span>
          <span className="text-gray-900">{alert.availability ?? alert.stock_levels ?? '-'}</span>
        </div>
        <div>
          <span className="font-medium text-gray-600">Tiempo de Entrega: </span>
          <span className="text-gray-900">{alert.lead_time ?? '-'}</span>
        </div>
        <div>
          <span className="font-medium text-gray-600">Tipo de Riesgo: </span>
          <span className="text-gray-900">{alert.risk_type || '-'}</span>
        </div>
      </div>
      <div className="text-gray-700 italic border-t border-gray-100 pt-3 mb-2 text-sm">
        {alert.description || '-'}
      </div>
      {alert.risk_reason && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-md px-4 py-2 mb-2 flex items-center gap-2">
          <span className="font-semibold text-yellow-700 text-sm">Motivo del Riesgo:</span>
          <span className="text-gray-800 text-sm">{alert.risk_reason}</span>
        </div>
      )}
      {alert.solutions && (
        <div className="bg-green-50 border border-green-200 rounded-md px-4 py-2 mt-2">
          <span className="font-semibold text-green-700 block mb-1 text-sm">Soluciones Recomendadas:</span>
          <ul className="list-disc list-inside text-green-900 text-xs">
            {Array.isArray(alert.solutions)
              ? alert.solutions.map((sol, i) => <li key={i}>{sol}</li>)
              : <li>{alert.solutions}</li>}
          </ul>
        </div>
      )}
    </div>
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="text-blue-600 text-lg font-semibold mb-2">Cargando alertas...</span>
        <span className="inline-block animate-spin border-2 border-blue-300 border-t-transparent rounded-full w-6 h-6"></span>
      </div>
    );
  if (!alerts || alerts.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="text-gray-400 text-lg font-semibold">No hay alertas para mostrar.</span>
      </div>
    );

  return (
    <div className="relative z-10">
      {/* Header */}
      <div className="text-center py-8">
        <div className="text-3xl font-bold text-blue-600 drop-shadow mb-2 tracking-wide">LUMINA</div>
        <div className="text-base text-blue-600 font-light opacity-90">Advanced Supply Chain Intelligence</div>
      </div>

      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 rounded-xl shadow-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Dashboard de Alertas Detalladas</h2>

          {/* Problem Summary */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-md px-4 py-3 mb-6 flex items-center gap-2">
            <span className="font-semibold text-yellow-700 text-sm">Resumen del Problema:</span>
            <span className="text-gray-800 text-sm">
              Se han detectado múltiples alertas críticas en la cadena de suministro que requieren atención inmediata para mantener la operación óptima.
            </span>
          </div>

          {/* High Priority */}
          <div className="mb-8">
            <h3 className="flex items-center text-lg font-semibold text-red-600 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-3 animate-pulse"></span>
              Alta Prioridad
            </h3>
            {groupedAlerts.High.length > 0
              ? groupedAlerts.High.map((alert, idx) => renderAlert(alert, idx, "High"))
              : <div className="text-center text-gray-400 py-6 text-sm">Sin alertas de alta prioridad.</div>}
          </div>

          {/* Medium Priority */}
          <div className="mb-8">
            <h3 className="flex items-center text-lg font-semibold text-yellow-600 mb-4">
              <span className="w-3 h-3 rounded-full bg-yellow-400 mr-3 animate-pulse"></span>
              Prioridad Media
            </h3>
            {groupedAlerts.Medium.length > 0
              ? groupedAlerts.Medium.map((alert, idx) => renderAlert(alert, idx, "Medium"))
              : <div className="text-center text-gray-400 py-6 text-sm">Sin alertas de prioridad media.</div>}
          </div>

          {/* Low Priority */}
          <div>
            <h3 className="flex items-center text-lg font-semibold text-green-600 mb-4">
              <span className="w-3 h-3 rounded-full bg-green-400 mr-3 animate-pulse"></span>
              Prioridad Baja
            </h3>
            {groupedAlerts.Low.length > 0
              ? groupedAlerts.Low.map((alert, idx) => renderAlert(alert, idx, "Low"))
              : <div className="text-center text-gray-400 py-6 text-sm">Sin alertas de prioridad baja.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;