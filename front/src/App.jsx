import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Alerts from './components/Alerts';
import Suppliers from './components/Suppliers';
import Summary from './components/Summary';
import RiskScores from './components/Disruption';
import Compilance from './components/Compilance';
import ChatBot from './components/chatbot';
import Disruption from './components/Disruption';
import { Bell, Settings, User, Home, Map, List, CheckSquare, Shield, Activity, Server, Box, Table } from 'lucide-react';
import { Chart } from 'chart.js';
import Login from './components/login';
import Register from './components/Register';
import MainLayout from './components/MainLayout';

// Map each route to its API endpoint
const ENDPOINTS = {
  '/dashboard': 'http://127.0.0.1:8000/api/dashboard',
  '/alerts': 'http://127.0.0.1:8000/api/alerts-summary',
  '/suppliers': 'http://127.0.0.1:8000/api/suppliers',
  '/compliance': 'http://127.0.0.1:8000/api/compliance',
  '/chatbot': 'http://127.0.0.1:8000/api/chatbot',
  '/disruption': 'http://127.0.0.1:8000/api/disruption',
  '/summary': 'http://127.0.0.1:8000/api/summary',
 
};

// Custom hook to get current location
function useCurrentPath() {
  const location = useLocation();
  return location.pathname;
}

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  // Store data for each endpoint
  const [data, setData] = useState({});
  // Store loading state for each endpoint
  const [loading, setLoading] = useState({});

  // Fetch data for a specific endpoint
  const handleGenerateInsights = async (endpoint) => {
    setLoading(prev => ({ ...prev, [endpoint]: true }));
    try {
      const res = await fetch(endpoint);
      const json = await res.json();
      setData(prev => ({ ...prev, [endpoint]: json }));
    } catch (e) {
      setData(prev => ({ ...prev, [endpoint]: { error: 'Error to obtain the insights' } }));
    }
    setLoading(prev => ({ ...prev, [endpoint]: false }));
  };

  function GenerateButtonWithRoute() {
    const path = useCurrentPath();
    const endpoint = ENDPOINTS[path];
    if (!endpoint) return null;
    return (
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        onClick={() => handleGenerateInsights(endpoint)}
        style={{ marginLeft: 16 }}
        disabled={loading[endpoint]}
      >
        {loading[endpoint] ? 'Generating...' : 'Generating insights'}
      </button>
    );
  }

  function getDataForRoute(path) {
    const endpoint = ENDPOINTS[path];
    return data[endpoint];
  }
  function getLoadingForRoute(path) {
    const endpoint = ENDPOINTS[path];
    return loading[endpoint] || false;
  }

  function setDashboardDataFromSummary(dashboardJson) {
    setData(prev => ({
      ...prev,
      [ENDPOINTS['/dashboard']]: dashboardJson
    }));
  }

  function setAlertsDataFromSummary(alertsJson) {
    setData(prev => ({
      ...prev,
      [ENDPOINTS['/alerts']]: alertsJson
    }));
  }

  function setSuppliersDataFromSummary(suppliersJson) {
    setData(prev => ({
      ...prev,
      [ENDPOINTS['/suppliers']]: suppliersJson
    }));
  }

  function setComplianceDataFromSummary(complianceJson) {
    setData(prev => ({
      ...prev,
      [ENDPOINTS['/compliance']]: complianceJson
    }));
  }

  function setRiskScoresDataFromSummary(riskScoresJson) {
    setData(prev => ({
      ...prev,
      [ENDPOINTS['/disruption']]: riskScoresJson
    }));
  }

  return (
    <Router>
      <Routes>
        {/* Login y registro SIN layout */}
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas CON layout */}
        <Route
          path="/*"
          element={
            token ? (
              <MainLayout GenerateButtonWithRoute={GenerateButtonWithRoute}>
                {/* El Outlet de MainLayout renderiza aquí */}
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="summary" element={
            <Summary
              data={data[ENDPOINTS['/dashboard']]}
              alertsData={data[ENDPOINTS['/alerts']]}
              suppliersData={data[ENDPOINTS['/suppliers']]}
              complianceData={data[ENDPOINTS['/compliance']]}
              riskScoresData={data[ENDPOINTS['/disrupts']]}
              loading={loading[ENDPOINTS['/dashboard']]}
              setDashboardDataFromSummary={setDashboardDataFromSummary}
              setAlertsDataFromSummary={setAlertsDataFromSummary}
              setSuppliersDataFromSummary={setSuppliersDataFromSummary}
              setComplianceDataFromSummary={setComplianceDataFromSummary}
              setRiskScoresDataFromSummary={setRiskScoresDataFromSummary}
            />
          } />
          <Route
            path="dashboard"
            element={
              <Dashboard
                data={getDataForRoute('/dashboard')}
                loading={getLoadingForRoute('/dashboard')}
              />
            }
          />
          <Route
            path="alerts"
            element={
              <Alerts
                data={getDataForRoute('/alerts')}
                loading={getLoadingForRoute('/alerts')}
              />
            }
          />
          <Route
              path="suppliers"
              element={
                <Suppliers
                  data={data[ENDPOINTS['/suppliers']]}
                  loading={loading[ENDPOINTS['/suppliers']]}
                />
              }
            />
          {/* <Route path="/risk-map" element={<RiskMap />} /> */}
          <Route path="compliance" element={
            <Compilance
              data={getDataForRoute('/compliance')}
              loading={getLoadingForRoute('/compliance')}
            />
          } />
          <Route path="chatbot" element={
            <ChatBot
              data={getDataForRoute('/chatbot')}
              loading={getLoadingForRoute('/chatbot')}
            />
          } />
          <Route path="disruption" element={
            <Disruption
              message={
                getDataForRoute('/disruption')?.disruption?.summary ||
                (getDataForRoute('/disruption')?.error ? getDataForRoute('/disruption').error : undefined)
              }
            />
          } />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
